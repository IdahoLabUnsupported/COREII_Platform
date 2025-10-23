// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED

// OSTI Article Information for use with sources pop-in
export interface OSTIArticle {
	shortId?: string | null;
	language: string;
	entry_date: string;
	relation?: string | null;
	report_number: string | null;
	identifier: string;
	journal_issue?: string;
	country_publication: string;
	publisher?: string;
	journal_type?: string;
	doi?: string;
	description: string;
	title: string;
	other_number?: string;
	contract_number?: string;
	publication_date: string;
	journal_volume?: string;
	osti_id: string;
	journal_name?: string;
	product_type: string;
	authors: {
		name: string;
		orcid: string | null;
		affiliation: string | null;
	}[];
	subjects: string[];
	article_type?: string;
	doe_contract_number: string[];
	sponsor_orgs: string[];
	research_orgs: string[];
	journal_issn?: string;
	other_identifiers?: string[] | null;
	links: {
		rel: string;
		href: string;
	}[];
	conference_info?: string | null | string[];
	format?: string;
	doe_funded_flag?: string;
}

// Messages used in the LLM chat
export interface Message {
    role: string;
    content: string;
    data?: RetrievedData;
    action?: {
        action: string;
        response?: string;
        topic?: string;
        dataset?: string;
        report?: string;
        earliest_year?: number | string;
    };
}

export interface RetrievedData {
    query: string;
    excerpts: KGObject[];
    reports: KGObject[];
    indexThreshold?: number;
    ragElapsedSeconds?: number;
    context?: string;
    contextualizedIds?: string[];
}

// a single data point in the knee point visualization
export interface KneeDataPoint {
    x: number;
    y: number;
}

// A single knowledge graph object.
export interface KGObject {
    id: string;
    objectType: string;    
    title?: string;
    source_id?: string;
    uentity_id?: string;
    excerpt_id?: string;
    report_id?: string;
    uri?: string;
    description?: string;
    n_records?: number;
    source?: string | KGObject;
    report?: string | KGObject;
    excerpt?: string | KGObject;
    uentity?: string | KGObject;
    reports?: KGObject[];
    excerpts?: KGObject[];
    entities?: KGObject[];
    report_type?: string;
    identifier?: string;
    n_excerpts?: number;
    excerpt_index?: number;
    report_metadata?: string;
    RELATIONS?: string[];
    cosineDistance?: number;
    similarityScore?: number;
    text_content?: string;
    json_content?: string;
    content_type?: string;
    reason?: string;
    pagination?: {
        totalCount: number;
        page: number;
        pageSize: number;
        firstPage: number;
        lastPage: number;
        showing: number;
        startIndex: number,
        endIndex: number,
    };
    oarticle?: OSTIArticle;
}

// A single node on the network graph,
// which could represent a knowledge graph object.
export interface Node extends KGObject {
    id: string;
    x?: number;
    y?: number;
    fx?: number;
    fy?: number;
    vx?: number;
    vy?: number;
    type?: string;
    target?: Edge;
}

// A graph edge that connect two nodes.
export interface Edge extends Omit<d3.SimulationLinkDatum<Node>, 'source' | 'target'> {
    source: Node | string;
    target: Node | string;
    value?: number;
}

// The full graphdata object, which
// contains graph nodes and edges that link them
export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}


// RAG search results payload that comes from the backend
// when a search is submitted.
export interface RAGSearchResults {
    query?: string;
    records: KGObject[];
    matchingExcerptIds: string[];
    matchingUentityIds: string[];
}

