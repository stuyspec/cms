import * as React from 'react';

import { Select } from '@rmwc/select';

interface IProps {
    role: string,
    onChange: (s: string) => void,
    error?: string,
    label: string,
    required?: boolean,
}

export const RoleField: React.SFC<IProps> = ({
    role,
    onChange,
    error,
    label,
    required
}) => {
    return (
        <Select
            className="UserField"
            value={role}
            onChange={(e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value)}
            label={label}
            enhanced
            outlined
            options={["Contributor", "Illustrator", "Photographer"]}
            required={required}
        />
    );
};

