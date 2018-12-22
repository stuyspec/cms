import * as React from 'react';
import './EditorHelpers.css';

interface IProps {
    value: string,
    onChange: (s: string) => void,
    touched: boolean,
}

export const TitleField: React.SFC<IProps> = ({
    value,
    onChange,
    touched,
}) => {
    const change = (e: React.FormEvent<HTMLInputElement>) => { onChange(e.currentTarget.value) };
    return (
        <div style={{minWidth: "250px"}}>
              <span
                className="TitleFieldInput"
                onInput={change}
                contentEditable={true}
                spellCheck={true}
                title="Rename"
                placeholder="Untitled article"
            >
            {value}
            </span>
          </div>
    )
};