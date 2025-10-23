// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import { ICON_MAP } from '../shared/constants';
import { KGObject } from '../shared/interfaces';
import 'd3';

type CustomNode = d3.Selection<SVGGElement, KGObject, SVGGElement, unknown>;


// add icons for nodes in a network graph
export const addGraphNode = (node: CustomNode) => {

    node.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 8)
        .attr("fill", "#e2e8f0");

    node.style("cursor", "pointer");

    /*
    node.append("text")
        .text(d.title || "untitled")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.55em")
        .style("font-size", "1em")
        .style("fill", iconInfo.color)
        .style("opacity", 0)
        .style("pointer-events", "none");
    */

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
};