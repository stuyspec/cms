import * as React from 'react';
import './UserHelpers.css';

import { TextField } from '@rmwc/textfield';

interface IProps {
    value: string,
    onChange: (s: string) => void,
    error?: string,
    label: string,
    required?: boolean
}

export const EmailField: React.SFC<IProps> = ({
    value,
    onChange,
    error,
    label,
    required
}) => {
    return (
        <TextField
            className="UserField"
            value={value}
            onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value)}
            label={label}
            outlined={true}
            size={75}
            required={required}
            pattern=".*@.*"
            autocomplete="Off"
        />
    );
};
