import * as React from 'react';
import './EditorHelpers.css'

import { IconButton } from '@rmwc/icon-button';
import { SimpleMenu, MenuItem } from '@rmwc/menu';

import { EditorView } from 'prosemirror-view';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { MarkType, Node } from 'prosemirror-model';
import { undo, undoDepth, redo, redoDepth } from 'prosemirror-history';

import { schema } from '../../schema';
import { EditorState, Transaction, TextSelection } from 'prosemirror-state';

import { LinkDialog } from './LinkDialog';

import { dialogs } from '../extensions/dialogs/dialogs';

//Marks are used in ProseMirror to change the appearance or metadata
//of the nodes that compose editor state. These include bold and italic marks.
const boldMark = schema.marks.strong;
const italicMark = schema.marks.em;
const linkMark = schema.marks.link;

//This generates functions to toggle the activation of each mark.
const toggleBold = toggleMark(boldMark);
const toggleItalic = toggleMark(italicMark);
const toggleLink = toggleMark(linkMark);

//This generates functions to change the type of the current block type selected by the cursor.
const setBlockParagraph = setBlockType(schema.nodes.paragraph);
const setBlockHeading = setBlockType(schema.nodes.heading, { level: 5 });
const setBlockCenteredHeading = setBlockType(schema.nodes.heading, { level: 4 });

interface IProps {
    editorView: EditorView
}

//Determines whether a mark is present in the current selection or cursor position.
function shouldBeChecked(editorView: EditorView, mark: MarkType): boolean {
    const { selection, storedMarks, doc } = editorView.state;
    if (selection.empty) {
        return mark.isInSet(storedMarks || []) || mark.isInSet(selection.$anchor.marks()) ? true : false
    }

    else return doc.rangeHasMark(selection.from, selection.to, mark);
}

//Generates function that inserts a new node or replaces a selection with it.
function insertNode(node: Node) {
    return (state: EditorState, dispatch: (tr: Transaction<any>) => void) => {
        dispatch(state.tr.replaceWith(state.selection.from, state.selection.to, node))
    }
}

const insertHorizontalRule = insertNode(schema.node(schema.nodes.horizontal_rule));

export const MenuBar: React.FunctionComponent<IProps> = ({ editorView }) => {
    const { state, dispatch } = editorView;

    const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
    const [lineChartDialogOpen, setLineChartDialogOpen] = React.useState(false);

    //Determines whether mark is currently active at cursor or in selection.
    const shouldBoldBeChecked = shouldBeChecked(editorView, boldMark);
    const shouldItalicBeChecked = shouldBeChecked(editorView, italicMark);
    const shouldLinkBeChecked = shouldBeChecked(editorView, linkMark);

    //If the selection is a TextSelection, it contains text.
    const selectionIsText = state.selection instanceof TextSelection;

    //onMouseDown={(e) => { e.preventDefault(); editorView.focus() }}

    return (
        <div className="MenuBarToolbar">
            <MenuButton
                icon="format_bold"
                title="Bold"
                onClick={() => { toggleBold(state, dispatch); }}
                checked={shouldBoldBeChecked}
                disabled={!(selectionIsText || shouldBoldBeChecked)}
            />
            <MenuButton
                icon="format_italic"
                title="Italic"
                onClick={() => { toggleItalic(state, dispatch); }}
                checked={shouldItalicBeChecked}
                disabled={!(selectionIsText || shouldItalicBeChecked)}
            />
            <MenuButton
                icon="link"
                title="Link"
                onClick={() => {
                    if (shouldLinkBeChecked) {
                        toggleLink(state, dispatch);
                    }
                    else setLinkDialogOpen(true);
                }}
                checked={shouldLinkBeChecked}
                disabled={!selectionIsText || state.selection.to == state.selection.from}
            />
            <LinkDialog
                open={linkDialogOpen}
                onClose={(result) => {
                    setLinkDialogOpen(false);
                    if (result) {
                        toggleMark(linkMark, { href: result.href })(state, dispatch);
                    }
                }}
                initialHref=""
            />
            <MenuDivider />
            <SimpleMenu handle={
                <button type="button" className="MenuBarTextButton">Type⏷</button>
            }>
                <MenuItem onClick={() => setBlockParagraph(state, dispatch)}>Plain</MenuItem>
                <MenuItem onClick={() => setBlockHeading(state, dispatch)}>Heading</MenuItem>
                <MenuItem onClick={() => setBlockCenteredHeading(state, dispatch)}>Centered Heading</MenuItem>
            </SimpleMenu>

            <AddExtensionDialog
                type="LineChartExtension"
                name="Line Chart"
                state={state}
                dispatch={dispatch}
                open={lineChartDialogOpen}
                onClose={() => setLineChartDialogOpen(false)}
            />

            <SimpleMenu handle={<button type="button" className="MenuBarTextButton">Insert⏷</button>} >
                <MenuItem onClick={() => insertHorizontalRule(state, dispatch)}>Horizontal Rule</MenuItem>
                <MenuItem onClick={() => setLineChartDialogOpen(true)}>Line Chart</MenuItem>
            </SimpleMenu>
            <MenuDivider />
            <MenuButton
                icon="undo"
                title="Undo"
                onClick={() => { undo(state, dispatch) }}
                disabled={undoDepth(state) == 0}
            />
            <MenuButton
                icon="redo"
                title="Redo"
                onClick={() => { redo(state, dispatch) }}
                disabled={redoDepth(state) == 0}
            />
        </div>
    );
}

interface IMenuButtonProps {
    icon: string,
    title?: string,
    onClick?: () => any,
    checked?: boolean,
    disabled?: boolean
}

const MenuButton: React.FunctionComponent<IMenuButtonProps> = (props) => {
    return (
        <IconButton
            {...props}
            type="button"
            title={props.title}
            ripple={false}
            className={props.checked && !props.disabled ? "CheckedMenuBarButton" : undefined}
            onMouseDown={(e) => e.preventDefault()}
        />
    )
}

//Divides logical sections in the menu.
const MenuDivider: React.FunctionComponent<{}> = ({ }) => (
    <div className="MenuBarDivider" />
)

interface IAddItemProps {
    type: string,
    name: string,
    state: EditorState,
    dispatch: (tr: Transaction<any>) => void,
    open: boolean,
    onClose: () => any
}

const AddExtensionDialog: React.FC<IAddItemProps> = ({ type, name, state, dispatch, open, onClose }) => {
    const Dialog = dialogs.get(type);

    if (!Dialog) {
        console.error(`Could not find dialog with type ${type}.`)
        return null;
    }

    return (
        <Dialog open={open} onSubmit={(e) => {
            onClose()
            if (e === null) {
                ;
            }
            else {
                insertNode(schema.node(schema.nodes.article_extension, {
                    type,
                    props: JSON.stringify(e)
                }))(state, dispatch)
            }
        }} />
    )
}