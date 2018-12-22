import * as React from 'react';
import './EditorHelpers.css'

interface IProps {
    value: string,
    onChange: (s: string) => void,
    isLabelVisible?: boolean,
    touched?: boolean,
    error?: string,
    label: string,

}

export const FocusField: React.SFC<IProps> = ({
    value,
    onChange,
    label,
    isLabelVisible = true,
    touched,
    error
}) => {
    return (
        <div className="EditorFieldDiv">
            {isLabelVisible && <label>{label}</label>}
            <div>
                <span
                    className="FocusFieldInput"
                    onInput={(e: React.FormEvent<HTMLSpanElement>) => { onChange(e.currentTarget.innerText) }}
                    contentEditable={true}
                    placeholder={label}
                    defaultValue={value}
                />
                {touched &&
                    (error && <p className="FocusFieldValidation">{error}</p>)}
            </div>
        </div>
    );
};