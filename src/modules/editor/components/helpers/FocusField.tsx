import * as React from 'react';
import './EditorHelpers.css'

import { TextField } from '@rmwc/textfield';

interface IProps {
    value: string,
    onChange: (s: string) => void,
    error?: string,
    label: string,
    required?: boolean
}

export const FocusField: React.SFC<IProps> = ({
    value,
    onChange,
    label,
    error,
    required
}) => {
    return (
        <TextField
            className="EditorField"
            value={value}
            onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value)}
            label={label}
            outlined={true}
            size={75}
            required={required}
        />
    );
};