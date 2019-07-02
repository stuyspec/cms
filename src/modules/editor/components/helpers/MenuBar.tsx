import * as React from 'react';

import { EditorState } from 'prosemirror-state';
import { Toolbar, ToolbarRow, ToolbarIcon } from '@rmwc/toolbar';

interface IProps {
    editorState: EditorState
}

export const MenuBar: React.FunctionComponent<IProps> = ({ }) => {
    return (
        <Toolbar>
            <ToolbarRow>
                <ToolbarIcon icon="bold" />
                <ToolbarIcon icon="italic" />
            </ToolbarRow>
        </Toolbar>
    );
}