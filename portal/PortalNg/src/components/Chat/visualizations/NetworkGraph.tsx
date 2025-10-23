// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import * as d3 from 'd3';
import { useEffect, useRef, useState } from 'react';
import { ICON_MAP } from '../shared/constants';
import { Node, Edge, GraphData } from '../shared/interfaces';
import { KGObject } from '../shared/interfaces'
import { addGraphNode } from './utils'

export default function NetworkpGraph({
    graphData,
    onUpdateActiveObject,
    width = 400,
    height = 400
}: {
    graphData: GraphData | null,
    onUpdateActiveObject: (newValue: KGObject | null) => void;
    width?: number;
    height?: number;    
}) {
    const svgRef = useRef(null);

    const [activeName, setActiveName] = useState<string | null>(null)
    const [activeColor, setActiveColor] = useState<string | null>(null)

    const createNodeShape = (selection: d3.Selection<SVGGElement, Node, SVGGElement, unknown>) => {
        selection.each(function(d) {

            const _node = d3.select(this as SVGGElement);
            const iconInfo = ICON_MAP[(d.objectType || "unknown") as keyof typeof ICON_MAP];
            addGraphNode(_node as unknown as d3.Selection<SVGGElement, Node, SVGGElement, unknown>);

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
        if (!svgRef.current || !graphData) return;


        const nodes = graphData.nodes;
        const edges = graphData.edges;

        d3.select(svgRef.current).selectAll("*").remove();
        const svg = d3.select<SVGSVGElement, unknown>(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const container = svg.append("g")
            .attr("class", "container")
            .attr("transform", `translate(${width / 2}, ${height * 0.1}) scale(0.8)`);

        // Create simulation
        const simulation = d3.forceSimulation<Node>(nodes)
            .force("link", d3.forceLink<Node, Edge>(edges).id(d => d.id))
            .force("charge", d3.forceManyBody().strength(-10))
            .force("center", d3.forceCenter(0, 0));


        // Add zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 4])
            .on("zoom", (event) => {
                container.attr("transform", event.transform);
            });

        // Apply zoom behavior to SVG
        svg.call(zoom);
        
        // Add initial transform to center the graph
        svg.call(zoom.transform, d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(0.8));

        // Create drag behavior
        const drag = d3.drag<SVGGElement, Node>()
            .on("start", (event: d3.D3DragEvent<SVGGElement, Node, Node>, d: Node) => {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;                  
            })
            .on("drag", (event, d) => {
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                // Keep the node fixed at its new position
                d.fx = event.x;
                d.fy = event.y;
            })
            .on("end", (event, d) => {
                if (!event.active) simulation.alphaTarget(0);
                // Clear the fixed position when drag ends
                if (d !== nodes[0]) { // Don't clear if it's the center node
                    d.fx = undefined;
                    d.fy = undefined;
                }
            })


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
            .call(createNodeShape)
            .call(drag); // Apply drag behavior to nodes

        // Fix center node
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
            <div className="h-6 flex flex-col">
                {activeName ? (
                    <p style={{ color: activeColor || undefined }} className="font-bold mt-auto">
                        {activeName}
                    </p>
                ) : (
                    <p className="text-muted mt-auto">Relationship map</p>
                )}
            </div>            
            <div className="w-full rounded-3xl">
                <svg ref={svgRef} />
            </div>
        </div>
    );
}