import * as React from 'react';
import './SearchBar.css';

import { TextField, TextFieldIcon } from '@rmwc/textfield';
//import { Icon } from '@rmwc/icon';

interface IProps {
    onChange: (s: string) => void,
    value: string,
    onEnter?: () => any,
}

export const SearchBar: React.SFC<IProps> = ({ onChange, value, onEnter }) => {
    const change = (e: React.FormEvent<HTMLInputElement>) => onChange(e.currentTarget.value)
    /*return (
        <div className="SearchBarDiv">
            <Icon name="search" />
            <input
                type="text"
                value={value}
                onChange={change}
                placeholder="Search for an article"
                className="SearchBarInput"
            />
        </div >
    )*/
    return (
        <div className="SearchBarInput">
            <TextField
                value={value}
                onChange={change}
                onKeyUp={(e: React.KeyboardEvent) => {
                    e.preventDefault();
                    if (e.keyCode === 13 && onEnter) {
                        onEnter()
                    }
                }}
                trailingIcon={{icon: "search", onClick: (e: any) => {
                    if (onEnter) {
                        onEnter()
                    }
                }}}
                fullwidth={true}
            />
        </div>
    )
}