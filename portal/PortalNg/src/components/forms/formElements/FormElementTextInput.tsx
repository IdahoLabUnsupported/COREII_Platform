// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import React from 'react';

type Props = {
    placeholder?: string;
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
};

const FormElementTextInput: React.FC<Props> = ({
    placeholder,
    label,
    value,
    onChange,
    className
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            <label className="mr-5 w-36">{label}</label>
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="
          input
          input-bordered
          input-secondary
          w-full
          bg-gray-300
          dark:bg-gray-900
        "
            />
        </div>
    );
}

export default FormElementTextInput;
