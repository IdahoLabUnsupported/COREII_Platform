// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from "react";
import ButtonIcon from "../../components/elements/ButtonIcon";

interface ActionsCellRendererProps {
    data: any;
    onEdit: (data: any) => void;
    onDelete: (data: any) => void;
}

const ActionsCellRenderer: React.FC<ActionsCellRendererProps> = ({ data, onEdit, onDelete }) => {
    return (
        <div className="flex items-center justify-center space-x-2">
<div className="w-8 h-8 flex items-center justify-center rounded-full">
<ButtonIcon
    label="edit"
          buttonIcon="edit"
          color="btn-ghost"
          buttonSize="btn-sm"
          onClick={() => onEdit(data)}
    />
</div>
    <div className="w-8 h-8 flex items-center justify-center rounded-full">
<ButtonIcon
    label="delete"
          buttonIcon="delete"
          color="btn-ghost"
          buttonSize="btn-sm"
          onClick={() => onDelete(data)}
    />
</div>
</div>
);
};

export default ActionsCellRenderer;