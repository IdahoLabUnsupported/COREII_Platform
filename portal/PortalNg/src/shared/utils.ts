// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { KGObject, GraphData, Node, Edge, RAGSearchResults } from './interfaces';


// Build an LLM prompt for RAG using retrieved context
export const buildRagPrompt = (originalPrompt: string, context: string, maxTokens: number = 1200) => {
    const prompt = `
        Here is some information: <information>${context.slice(0, maxTokens)}</information>.
        Use the information to answer the following question,
        or tell me about the following topic.
        If you can't answer the question or tell me about the topic
        from the informtion provided,
        say "No information found."
        Do not make up an answer, and do not make up any new information.
        Question or topic: ${originalPrompt}

        Answer: 
    `
    return prompt.trim()
}

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
	};
	if (MAP[key as keyof typeof MAP] != null) {
		return MAP[key as keyof typeof MAP];
	}
	const k = key.charAt(0).toUpperCase() + key.slice(1);
	return k.replace(/_/g, ' ');
};

/*
// filter out objects with duplicate ids
const removeDuplicateIds = (arr: KGObject[]): KGObject[] => {
    const uniqueIds = new Map<string, KGObject>();
    arr.forEach((obj) => {
        if (!uniqueIds.has(obj.id)) {
            uniqueIds.set(obj.id, obj);
        }
    });
    return Array.from(uniqueIds.values());
}
*/

// Transform the RAG search results into a into
// graph data that can be visualized in a D3 network graph
export const searchResultsToGraphData = (searchResults: RAGSearchResults): GraphData => {

    const nodes: Node[] = []
    const edges: Edge[] = []

    // add user query as a node in the graph
    if (typeof searchResults.query === 'string') {
        nodes.push({id: "query", objectType: "query", "title": searchResults.query})
    }

    // add each matching excerpt as a graph node
    for (const matchingExcerptId of searchResults.matchingExcerptIds) {
        const excerpt = searchResults.records.find((r: KGObject) => r.id === matchingExcerptId)
        if (excerpt) {
            // add the excerpt to the graph
            if (!nodes.map(n => n.id).includes(excerpt.id)) {
                nodes.push(excerpt)
            }
            // connect excerpt to the user query
            if (typeof searchResults.query === 'string') {
                edges.push({ source: "query", target: excerpt.id})
            }
            // add excerpt's parent report as a graph node
            if (excerpt.report) {
                if (!nodes.map(n => n.id).includes((excerpt.report as KGObject).id)) {
                    nodes.push((excerpt.report as KGObject))
                }
                // connect excerpt node to its parent report
                edges.push({ source: excerpt.id, target: (excerpt.report as KGObject).id})
            }
            // add the excerpt's data source
            if (excerpt.source) {
                if (!nodes.map(n => n.id).includes((excerpt.source as KGObject).id)) {
                    nodes.push((excerpt.source as KGObject))
                }
                // connect excerpt node to its data source
                edges.push({ source: excerpt.id, target: (excerpt.source as KGObject).id})
            }
        }
    }

    // add each matching unique entity to the graph
    for (const matchingUentityId of searchResults.matchingUentityIds) {
        const uentity = searchResults.records.find((r: KGObject) => r.id === matchingUentityId)
        if (uentity) {
            // add the uentity to the graph
            if (!nodes.map(n => n.id).includes(uentity.id)) {
                nodes.push(uentity)
            }
            // connect uentity to the user query
            if (typeof searchResults.query === 'string') {
                edges.push({ source: "query", target: uentity.id})
            }
            // connect the uentity to its parent excerpts and reports
            for (const entity of searchResults.records.filter(r => r.objectType === "entity" && r.uentity_id === uentity.id)) {
                
                // find the entity's parent excerpt
                const excerpt = entity.excerpt as KGObject;
                
                if (excerpt) {
                    
                    // add excerpt to the graph
                    if (!nodes.map(n => n.id).includes(excerpt.id)) {
                        nodes.push(excerpt)
                    }
                    // connect uentity to the excerpt
                    edges.push({ source: uentity.id, target: excerpt.id})

                    // connect the excerpt to its parent report
                    const report = entity.report as KGObject;
                    if (report) {
                        if (!nodes.map(n => n.id).includes(report.id)) {
                            nodes.push(report)
                        }
                        edges.push({ source: excerpt.id, target: report.id})
                    }

                    // connect report to the data source
                    const source = entity.source as KGObject;
                    if (source) {
                        if (!nodes.map(n => n.id).includes(source.id)) {
                            nodes.push(source)
                        }
                        edges.push({ source: report.id, target: source.id})
                    }

                    /*

                    if (excerpt.report) {
                        if (!nodes.map(n => n.id).includes((excerpt.report as KGObject).id)) {
                            nodes.push((excerpt.report as KGObject))
                        }
                        edges.push({ source: excerpt.id, target: (excerpt.report as KGObject).id})
                    }
                    */

                }

            }


        }
    }
    /*
        // add each unique entity as a graph node
        for (const matchingUentityId of searchResults.matchingUentityIds) {
            const uentity = searchResults.records.find((r: KGObject) => r.id === matchingUentityId)
            if (uentity) {
                nodes.push(uentity)
                if (typeof searchResults.query === 'string') {
                    edges.push({ source: "query", target: uentity.id})
                }
            }
        }

    */


    /*
    // iterate over each database object
    // and add it as a graph node
    searchResults.records.forEach((obj) => {
        // add the object itself
        nodes.push(obj)
        // add the objects the object is related to
        for (const relation of ["source", "report", "excerpt"]) {
            const _relatedObj: Node | null = obj[relation as keyof typeof obj] as Node
            if (_relatedObj) {
                nodes.push(_relatedObj)
            }
        }
    })
    */

    /*
    // remove duplicate nodes
    nodes = removeDuplicateIds(nodes);

    // if the user query was used, link it to its matching uentities and excerpts
    if (typeof searchResults.query === 'string') {
        for (const matchingUentityId of searchResults.matchingUentityIds) {
            edges.push({ source: "query", target: matchingUentityId})
        }
        for (const matchingExcerptId of searchResults.matchingExcerptIds) {
            edges.push({ source: "query", target: matchingExcerptId})
        }
    }

    // link matching uentities to their parent nodes.
    // iterate over each matching uentity
    for (const matchingUentityId of searchResults.matchingUentityIds) {
        // iterate over each parent entity
        for (const entity of nodes.filter(n => n.objectType === "entity" && n.uentity_id === matchingUentityId)) {
            edges.push({ source: matchingUentityId, target: entity.id})
            // add the entity's parent excerpt
            if (entity.excerpt_id) {
                edges.push({ source: entity.id, target: entity.excerpt_id})
                // add the parent excerpt's report
                if (entity.report_id) {
                    edges.push({ source: entity.excerpt_id, target: entity.report_id})
                    // add the parent report's source
                    if (entity.source_id) {
                        edges.push({ source: entity.report_id, target: entity.source_id})
                    }
                }
            }
        }
    }

    // link matching excerpts to their parent nodes.
    for (const matchingExcerptId of searchResults.matchingExcerptIds) {
        // add the parent excerpt's report
        const excerpt = nodes.find(n => n.objectType === "excerpt" && n.id === matchingExcerptId)
        if (excerpt?.report_id) {
            edges.push({ source: excerpt.id, target: excerpt.report_id})
            // add the parent report's source
            if (excerpt.source_id) {
                edges.push({ source: excerpt.report_id, target: excerpt.source_id })
            }
        }
    }
    */

    return { nodes, edges };
}