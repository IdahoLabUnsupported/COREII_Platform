// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
// A single knowledge graph object.
export interface KGObject {
    id: string;
    title: string;
    source_id?: string;
    uentity_id?: string;
    excerpt_id?: string;
    report_id?: string;
    uri?: string;
    description?: string;
    n_records?: number;
    objectType: string;
    source?: string | KGObject;
    report?: string | KGObject;
    excerpt?: string | KGObject;
    reports?: KGObject[];
    excerpts?: KGObject[];
    entities?: KGObject[];
    report_type?: string;
    report_metadata?: string;
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