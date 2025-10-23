// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { ICON_MAP } from '../shared/constants';
import { Node, Edge, GraphData } from '../shared/interfaces';
import { buildGraphDataFromObject } from '../shared/utils';
import { KGObject } from '../shared/interfaces'

export default function ObjectRelationshipGraph({
    activeObject,
    onUpdateActiveObject,
    width = 200,
    height = 200
}: {
    activeObject: KGObject | null,
    onUpdateActiveObject: (newValue: KGObject | null) => void;
    width?: number;
    height?: number;    
}) {
    const svgRef = useRef(null);

    //const showUserQuery = false;
    const [graphData, setGraphData] = useState<GraphData | null>(null);
    const [activeName, setActiveName] = useState<string | null>(null)
    const [activeColor, setActiveColor] = useState<string | null>(null)


    const addNodeIcons = (node: d3.Selection<SVGGElement, Node, SVGGElement, unknown>) => {
        const icons = node
            .append("svg")
            .attr("width", 16)
            .attr("height", 16)
            .attr("viewBox", "0 0 16 16")
            .attr("x", -8)
            .attr("y", -8)
            .attr("class", "node-icon");
    
        icons
            .append("path")
            .attr("d", d => ICON_MAP[d.objectType as keyof typeof ICON_MAP]?.path || ICON_MAP.unknown.path)
            .attr("fill", d => ICON_MAP[d.objectType as keyof typeof ICON_MAP]?.color || ICON_MAP.unknown.color)
            .attr("fill-rule", d => d.objectType === "uentity" ? "evenodd" : "nonzero");
    
        return icons;
    };

    const createNodeShape = (selection: d3.Selection<SVGGElement, Node, SVGGElement, unknown>) => {
        selection.each(function(d) {
            const _node = d3.select(this as SVGGElement);
            const iconInfo = ICON_MAP[(d.objectType || "unknown") as keyof typeof ICON_MAP];
            
            _node.append("circle")
                .attr("cx", 0)
                .attr("cy", 0)
                .attr("r", 8)
                .attr("fill", "#e2e8f0");
            
            addNodeIcons(_node as unknown as d3.Selection<SVGGElement, Node, SVGGElement, unknown>);

            /*
            _node.append("text")
                .text(d.title || "untitled")
                .attr("text-anchor", "middle")
                .attr("dy", "-0.55em")
                .style("font-size", "1em")
                .style("fill", iconInfo.color)
                .style("opacity", 0)
                .style("pointer-events", "none");
            */
                
            _node.style("cursor", "pointer");
            
            _node.on("mouseover", function() {
                const element = d3.select(this as SVGGElement);
                element.selectAll("circle")
                    .attr("transform", "translate(0, 0) scale(2)");
                element.selectAll(".node-icon")
                    .attr("transform", "scale(1.5)");
                //element.selectAll("text")
                //    .style("opacity", 1);
                setActiveName(d.title || '')
                setActiveColor(iconInfo.color)
            })
            .on("mouseout", function() {
                const element = d3.select(this);
                element.selectAll("circle")
                    .attr("transform", "translate(0, 0) scale(1)");
                element.selectAll(".node-icon")
                    .attr("transform", "scale(1)");
                element.selectAll("text")
                    .style("opacity", 0);
                setActiveName(null)
            })
            .on("click", function(event) {
                event.stopPropagation();
                const element = d3.select(this);
                const _activeNode = element.data()[0] as Node;
                if (_activeNode.objectType !== "query") {
                    onUpdateActiveObject({ id: _activeNode.id, objectType: _activeNode.objectType })
                }
            });
        });
    }


    useEffect(() => {
        if (activeObject) {
            const _graphData: GraphData = buildGraphDataFromObject(activeObject);
            setGraphData(_graphData);
        } else {
            setGraphData(null)
        }
    }, [activeObject]);


    useEffect(() => {


        if (!svgRef.current || !graphData) return;

        const nodes = graphData.nodes;
        const edges = graphData.edges;

        // Calculate node depths
        const nodeDepths = new Map<string, number>();
        const rootNode = nodes[0];
        
        if (rootNode) {
            // Initialize with root node
            nodeDepths.set(rootNode.id, 0);
            
            // Breadth-first search to assign depths
            const queue = [rootNode];
            const visited = new Set([rootNode.id]);
            
            while (queue.length > 0) {
                const currentNode = queue.shift()!;
                const currentDepth = nodeDepths.get(currentNode.id)!;
                
                // Find all connected nodes
                const connectedEdges = edges.filter(edge => 
                    edge.source === currentNode.id || 
                    (typeof edge.source === 'object' && edge.source.id === currentNode.id)
                );
                
                for (const edge of connectedEdges) {
                    const targetId = typeof edge.target === 'string' ? edge.target : edge.target.id;
                    if (!visited.has(targetId)) {
                        visited.add(targetId);
                        nodeDepths.set(targetId, currentDepth + 1);
                        queue.push(nodes.find(n => n.id === targetId)!);
                    }
                }
            }
        }

        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const container = svg.append("g")
            .attr("class", "container")
            .attr("transform", `translate(${width / 2}, ${height * 0.1}) scale(0.8)`);

        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges)
                .id(d => d.id)
                .distance(5)) // Set consistent link distance
            .force("charge", d3.forceManyBody()
                .strength(-300)) // Increased repulsion
            .force("x", d3.forceX(0).strength(0.1)) // Weak force toward center x
            .force("y", d3.forceY((d: Node) => {
                const depth = nodeDepths.get(d.id) || 0;
                return depth * 60; // Vertical spacing between levels
            }).strength(0.5)); // Stronger vertical positioning

        const link = container.append("g")
            .selectAll("line")
            .data(edges)
            .join("line")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.25);
 
        const nodeGroup = container.append("g")
            .selectAll<SVGGElement, Node>("g")
            .data(nodes)
            .join("g")
            .call(createNodeShape);

        // Fix the root node position
        //if (rootNode) {
        //    rootNode.fx = 0;
        //    rootNode.fy = 0;
        //}
        if (nodes[0]) {
            nodes[0].fx = 0;
            nodes[0].fy = 0;
        }

        simulation.on("tick", () => {
            link
                .attr("x1", d => {
                    const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
                    return source?.x ?? 0;
                })
                .attr("y1", d => {
                    const source = typeof d.source === 'string' ? nodes.find(n => n.id === d.source) : d.source;
                    return source?.y ?? 0;
                })
                .attr("x2", d => {
                    const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
                    return target?.x ?? 0;
                })
                .attr("y2", d => {
                    const target = typeof d.target === 'string' ? nodes.find(n => n.id === d.target) : d.target;
                    return target?.y ?? 0;
                });
            nodeGroup.attr("transform", (d: Node) => `translate(${d.x},${d.y})`);
        });

        return () => {
            simulation.stop();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [width, height, graphData]);

    return (
        <div className="">
            <div className="h-12">
                {activeName && (
                    <p style={{ color: activeColor || undefined }} className="font-bold">
                        {activeName}
                    </p>
                )}
            </div>            
            <div className="w-min rounded-3xl">
                <svg ref={svgRef} />
            </div>
        </div>
    );
}