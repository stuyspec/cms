import * as React from 'react';
import './EditorHelpers.css';

interface IProps {
    value: string,
    onChange: (s: string) => void,
    isLabelVisible?: boolean,
    touched?: boolean,
    error?: string,
    label: string,
    autoComplete?: string,
}

export const NumberField: React.SFC<IProps> = ({
    value,
    onChange,
    label,
    isLabelVisible = true,
    touched,
    error,
    autoComplete
}) => {
    const change = (e: React.FormEvent<HTMLInputElement>) => { onChange(e.currentTarget.value) };
    return (
        <div className="EditorFieldDiv">
            {isLabelVisible && <label>{label}</label>}
            <div>
                <input
                    className="NumberFieldInput"
                    value={value}
                    onChange={change}
                    autoComplete={autoComplete}
                    placeholder={label}
                    type="text"
                />
                {touched &&
                    (error && <p className="EditorFieldValidation">{error}</p>)}
            </div>
        </div>
    )
};

