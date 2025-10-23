// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { StrictModeDroppable } from "./StrictModeDroppable";

//CSS
import "./DragDropBasic.css";

const menu = {
    width: "35px",
    height: "5px",
    backgroundColor: "black",
    margin: "6px 0",
};

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    // display: "flex",

    // change background colour if dragging
    background: isDragging ? "#dddddd" : "grey",

    // styles we need to apply on draggables
    ...draggableStyle,
});

const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? "lightblue" : "lightgrey",
    padding: grid,
    width: 250,
});
export default function DragDropBasic({ props }) {
    const items: Array<any> = new Array<any>();
    const itemsSelected: Array<any> = new Array<any>();
    props.items.map((item) => {
        let newItem = {
            id: `item-${item.id}`,
            key: item.id,
            content: item.name,
        };
        if (props.itemsSelected.indexOf(item.id) >= 0) {
            itemsSelected.push(newItem);
        } else {
            items.push(newItem);
        }
    });

    const [state, setState] = useState({
        items: items,
        selected: itemsSelected,
    });

    /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    const id2List = {
        droppable: "items",
        droppable2: "selected",
    };

    function getList(id) {
        return state[id2List[id]];
    }

    function onDragEnd(result) {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );
            var tempState = state;
            tempState[id2List[source.droppableId]] = items;
            //@ts-ignore
            setState(tempState);
        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );

            setState({
                //@ts-ignore
                items: result.droppable,
                //@ts-ignore
                selected: result.droppable2,
            });
            props.updateSelected(
                //@ts-ignore
                result.droppable2.map((a) => {
                    return a.key;
                })
            );
        }
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <StrictModeDroppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className="drag-drop-list drag-drop-list-left"
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {state.items.length > 0 &&
                            state.items.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    className="drag-drop-item"
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(provided, snapshot) => (
                                        <div>
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps
                                                        .style
                                                )}
                                            >
                                                <div
                                                    style={{
                                                        float: "right",
                                                        marginTop: "-9px",
                                                    }}
                                                >
                                                    <div style={menu} />
                                                    <div style={menu} />
                                                    <div style={menu} />
                                                </div>
                                                {item.content}
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                        {provided.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
            <StrictModeDroppable droppableId="droppable2">
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        className="drag-drop-list-right"
                        style={getListStyle(snapshot.isDraggingOver)}
                    >
                        {state.selected.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                        )}
                                    >
                                        <div
                                            style={{
                                                float: "right",
                                                marginTop: "-9px",
                                            }}
                                        >
                                            <div style={menu} />
                                            <div style={menu} />
                                            <div style={menu} />
                                        </div>
                                        {item.content}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </StrictModeDroppable>
        </DragDropContext>
    );
}
