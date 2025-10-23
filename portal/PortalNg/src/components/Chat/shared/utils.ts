// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject, GraphData, Node, Edge, Message, OSTIArticle } from './interfaces';
import { BACKEND_RESOURCES } from './constants';


interface ObjectChildren {
    reports?: KGObject[];
    excerpts?: KGObject[];
    entities?: KGObject[];
    pagination?: object;
}


// Iterate over the potential child objects of a knowledge graph object
// and fetch them from the database if they exist.
export const getObjectChildren = async (_obj: KGObject, page: number = 0, pageSize: number = 10): Promise<object> => {
    const CHILD_MAP = {
        reports: { table: "report", parentIdKey: "source_id" },
        excerpts: { table: "excerpt", parentIdKey: "report_id" },
        entities: { table: "entity", parentIdKey: "excerpt_id" },
    }
    const children: ObjectChildren = {};
    for (const [childColumnName, child] of Object.entries(CHILD_MAP)) {
        if (_obj.RELATIONS?.includes(childColumnName)) {

            let parentIdKey = child.parentIdKey

            if (_obj.objectType === 'uentity') {
                parentIdKey = "uentity_id"
            } 

            const url = BACKEND_RESOURCES.kg.url + `list-objects?table_name=${child.table}&constraint_key=${parentIdKey}&constraint_val=${_obj.id}&page=${page}&page_size=${pageSize}`;
            const response = await fetch(url);
            const responseData = await response.json();
            const { results, ...paginationDetails } = responseData;
            children[childColumnName as keyof ObjectChildren] = results;
            children.pagination = paginationDetails;
        };
    }
    return children;
};


// clean an object key to display it nicely
export const cleanKey = (key: string) => {
	const MAP = {
		id: 'ID',
		uri: 'URI',
		source_id: 'Source ID',
		artifact_id: 'Artifact ID',
		entity_id: 'Entity ID',
        report_id: "Report ID",
        uentity_id: "Unique entity ID",
        excerpt_id: "Excerpt ID",
        objectType: "Object type",
        source: "Data source",
        json_content: "JSON Content",
        uentity: "Unique entity",
        report_metadata: "Metadata",
	};
	if (MAP[key as keyof typeof MAP] != null) {
		return MAP[key as keyof typeof MAP];
	}
	const k = key.charAt(0).toUpperCase() + key.slice(1);
	return k.replace(/_/g, ' ');
};


// remove objects with duplicate ids
export const removeDuplicateIds = (items: KGObject[]): KGObject[] => {
    const seenIds = new Set<string | number>();
    return items.filter(item => {
        if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            return true;
        }
        return false;
    });
};


// Represent a single object's relationships with graph data so it can be visualized.
// The first node is treated as the "root node" at the top of the hierarchy tree,
// so make sure that the highest node in the hierarchy is added to the array first.
export const buildGraphDataFromObject = (obj: KGObject): GraphData =>  {

    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (obj.objectType == 'source') {
        nodes.push(obj)
        obj.reports?.forEach(report => {
            nodes.push(report)
            edges.push({ source: obj.id, target: report.id})
        })
    }

    if (obj.objectType === 'report') {
        if (typeof obj.source !== 'string' && obj?.source?.id) {
            nodes.push(obj.source)
            nodes.push(obj)
            edges.push({ source: obj.source.id, target: obj.id });
        }
        obj?.excerpts?.forEach(excerpt => {
            nodes.push(excerpt)
            edges.push({ source: obj.id, target: excerpt.id })
        })
    }

    if (obj.objectType === 'excerpt') {
        if (typeof obj.report !== 'string' && obj?.report?.id) {
            if (typeof obj.source !== 'string' && obj?.source?.id) {
                nodes.push(obj.source)
                edges.push({ source: obj.source.id, target: obj.report.id })
            }            
            nodes.push(obj.report)
            nodes.push(obj)
            edges.push({ source: obj.report.id, target: obj.id });
            obj?.entities?.forEach(entity => {
                nodes.push(entity)
                edges.push({ source: obj.id, target: entity.id })
            })
        }
    }

    if (obj.objectType === 'entity') {
        if (typeof obj.excerpt !== 'string' && obj?.excerpt?.id) {
            if (typeof obj.report !== 'string' && obj?.report?.id) {
                if (typeof obj.source !== 'string' && obj?.source?.id) {
                    nodes.push(obj.source)
                    nodes.push(obj.report)
                    nodes.push(obj.excerpt)
                    if (typeof obj.uentity !== 'string' && obj?.uentity?.id) {
                        nodes.push(obj.uentity)
                        edges.push({ source: obj.uentity.id, target: obj.id })
                    }
                    nodes.push(obj)
                    edges.push({ source: obj.source.id, target: obj.report.id })
                    edges.push({ source: obj.report.id, target: obj.excerpt.id })
                    edges.push({ source: obj.excerpt.id, target: obj.id })
                }
            }
        }
    }

    if (obj.objectType === 'uentity') {
        nodes.push(obj)
        obj?.entities?.forEach(entity => {
            nodes.push(entity)
            edges.push({ source: obj.id, target: entity.id })
        })
    }

    return { nodes: removeDuplicateIds(nodes), edges };
};


// build graph data from an array of excerpt objects, so we can visualize relationships
// in the objects that are returned in a RAG search
export const buildGraphDataFromExcerpts = (excerpts: KGObject[], queryString: string | null): GraphData =>  {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    nodes.push({
        id:'query',
        objectType: 'query',
        title: queryString ?? "Query",
    })

    for (const obj of excerpts) {
        if (typeof obj.report !== 'string' && obj?.report?.id) {
            if (typeof obj.source !== 'string' && obj?.source?.id) {
                nodes.push(obj.source)
                edges.push({ source: obj.source.id, target: obj.report.id })
                edges.push({ source: 'query', target: obj.source.id })
            }            
            nodes.push(obj.report)
            nodes.push(obj)
            edges.push({ source: obj.report.id, target: obj.id });
            //obj?.entities?.forEach(entity => {
            //    nodes.push(entity)
            //    edges.push({ source: obj.id, target: entity.id })
            //})
        }
    }
    return { nodes: removeDuplicateIds(nodes), edges };
}



// Format the list of search results into a hierarchy for cleaner display on the UI.
export const formatSearchResultsAsHierarchy = (message: Message) => {
    const hierarchy: KGObject[] = [];

    let excerpts: KGObject[] = removeDuplicateIds(message?.data?.excerpts || [])        
    let reports: KGObject[] = removeDuplicateIds([
        ...message?.data?.reports || [],
        ...(message?.data?.excerpts || []).map(x => x.report as KGObject)
    ])        
    let sources: KGObject[] = removeDuplicateIds([
        ...excerpts.map(x => x.source as KGObject),
        ...reports.map(x => x.source as KGObject),
    ])

    // iterate over each data source
    for (const source of sources) {
        // add it to the hierarchy
        const newSource = {...source, reports: [] as KGObject[]}
        hierarchy.push(newSource)

        // iterate over each report and add it to the source hierarchy
        for (let report of reports) {
            const newReport = {...report, excerpts: [] as KGObject[]}
            if (report.source_id === source.id) {
                newSource.reports.push(newReport)
            }
            // iterate over each excerpt and add it to the report hierarchy
            for (const excerpt of excerpts) {
                if (excerpt.report_id === report.id) {
                    newReport.excerpts.push(excerpt)
                }
            }
            newReport.excerpts = removeDuplicateIds(newReport.excerpts)
        }
        newSource.reports = removeDuplicateIds(newSource.reports)
    }
    return removeDuplicateIds(hierarchy)
}

// Text to show as a preview of an excerpt
export const getExcerptPreviewText = (excerpt: KGObject): string => {
    try {
        if (excerpt?.text_content?.length) {
            return excerpt.text_content.slice(0, 100) + '...'
        } else {
            return excerpt.title//JSON.stringify((excerpt as KGObject).json_content).slice(0, 100) + '...'
        }
    } catch (error) {
        return "unknown report content"
    }
}

// Retrieve OSTI Article objects from KG Objects
export const retrieveOSTIArticles = (message: Message) :OSTIArticle[] => {

    let OSTIArticles: OSTIArticle[] = [];
    let reports: KGObject[];

    reports = message?.data?.reports

    console.log("Reports:", reports);
    for(let report of reports) {
        OSTIArticles.push(report.oarticle)
    }
    return OSTIArticles

}
