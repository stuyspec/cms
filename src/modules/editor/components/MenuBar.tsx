import * as React from 'react';

import { IconButton } from '@rmwc/icon-button';
import { SimpleMenu, MenuItem } from '@rmwc/menu';

import { EditorView } from 'prosemirror-view';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { MarkType, Node } from 'prosemirror-model';
import { undo, undoDepth, redo, redoDepth } from 'prosemirror-history';

import { schema } from '../schema';
import { EditorState, Transaction, TextSelection, NodeSelection } from 'prosemirror-state';

import { LinkDialog } from './helpers/LinkDialog';

import { dialogs } from './extensions/dialogs';

import { createUseStyles } from 'react-jss';
import { IMedium } from '../queryHelpers';

const useStyles = createUseStyles({
    Toolbar: {
        height: "40px",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        border: "1px solid silver",
        borderBottom: "none",
    },
    Divider: {
        width: "12px",
    },
    TextButton: {
        background: "none",
        border: "none",
        fontFamily: "Roboto",
        fontWeight: "bold",
        fontSize: "15px",
    },
    CheckedButton: {
        backgroundColor: "gainsboro",
        borderRadius: "4px",
    }
})

//Marks are used in ProseMirror to change the appearance or metadata
//of the nodes that compose editor state. These include bold and italic marks.
const boldMark = schema.marks.strong;
const italicMark = schema.marks.em;
const linkMark = schema.marks.link;
const highlightMark = schema.marks.highlight;

//This generates functions to toggle the activation of each mark.
const toggleBold = toggleMark(boldMark);
const toggleItalic = toggleMark(italicMark);
const toggleLink = toggleMark(linkMark);
const toggleHighlight = toggleMark(highlightMark)

//This generates functions to change the type of the current block type selected by the cursor.
const setBlockParagraph = setBlockType(schema.nodes.paragraph);
const setBlockHeading = setBlockType(schema.nodes.heading, { level: 5 });
const setBlockCenteredHeading = setBlockType(schema.nodes.heading, { level: 4 });

interface IProps {
    editorView: EditorView,
    media: IMedium[],
    onMediumAdd: (medium: IMedium) => any
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

export const MenuBar: React.FunctionComponent<IProps> = ({ editorView, media, onMediumAdd: onMediumAdd }) => {
    const styles = useStyles();

    const { state, dispatch } = editorView;

    const [linkDialogOpen, setLinkDialogOpen] = React.useState(false);
    

    const [currentExtensionInfo, setCurrentExtensionInfo] = React.useState<IExtensionInfo | undefined>(undefined);
    const [shouldEditBeVisible, setShouldEditBeVisible] = React.useState(false);

    //Determines whether mark is currently active at cursor or in selection.
    const shouldBoldBeChecked = shouldBeChecked(editorView, boldMark);
    const shouldItalicBeChecked = shouldBeChecked(editorView, italicMark);
    const shouldLinkBeChecked = shouldBeChecked(editorView, linkMark);
    const shouldHighlightBeChecked = shouldBeChecked(editorView, highlightMark)

    if (state.selection instanceof NodeSelection) {
        const { node } = state.selection as NodeSelection;
        if (node.type.name === 'article_extension' && !shouldEditBeVisible) {
            setShouldEditBeVisible(true)
        }
    }
    else if (shouldEditBeVisible) {
        setShouldEditBeVisible(false)
    }

    //If the selection is a TextSelection, it contains text.
    const selectionIsText = state.selection instanceof TextSelection;

    //onMouseDown={(e) => { e.preventDefault(); editorView.focus() }}

    return (
        <div className={styles.Toolbar}>
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
                icon="format_color_fill"
                title="Highlight"
                onClick={() => { toggleHighlight(state, dispatch); }}
                checked={shouldHighlightBeChecked}
                disabled={!(selectionIsText || shouldHighlightBeChecked)}
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
            {!linkDialogOpen || (
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
            )}
            <MenuDivider />
            <SimpleMenu handle={
                <button type="button" className={styles.TextButton}>Type⏷</button>
            }>
                <MenuItem onClick={() => setBlockParagraph(state, dispatch)}>Plain</MenuItem>
                <MenuItem onClick={() => setBlockHeading(state, dispatch)}>Heading</MenuItem>
                <MenuItem onClick={() => setBlockCenteredHeading(state, dispatch)}>Centered Heading</MenuItem>
            </SimpleMenu>

            <AddExtensionDialog
                extensionInfo={currentExtensionInfo}
                state={state}
                media={media}
                onMediumAdd={onMediumAdd}
                dispatch={dispatch}
                onClose={() => setCurrentExtensionInfo(undefined)}
            />

            <SimpleMenu handle={<button type="button" className={styles.TextButton}>Insert⏷</button>} >
                <MenuItem onClick={() => insertHorizontalRule(state, dispatch)}>Horizontal Rule</MenuItem>
                <MenuItem onClick={() => setCurrentExtensionInfo({type: 'LineChartExtension'})}>Line Chart</MenuItem>
                <MenuItem onClick={() => setCurrentExtensionInfo({type: 'BarChartExtension'})}>Bar Chart</MenuItem>
                <MenuItem onClick={() => setCurrentExtensionInfo({type: 'PieChartExtension'})}>Pie Chart</MenuItem>
                <MenuItem onClick={() => setCurrentExtensionInfo({type: 'MediaExtension'})}>Media</MenuItem>
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
                title="Redo
                "
                onClick={() => { redo(state, dispatch) }}
                disabled={redoDepth(state) == 0}
            />
            {!shouldEditBeVisible || (
                <>
                <MenuDivider />
                <MenuButton
                icon="edit"
                title="Edit selected item"
                onClick={() => {
                    const { node } = state.selection as NodeSelection;
                    if (!currentExtensionInfo) {
                        setCurrentExtensionInfo({
                            type: node.attrs['type'],
                            props: node.attrs['props'],
                            mediaIds: node.attrs['media']
                        })
                    }
                }}
                />
                </>
            )}
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
    const styles = useStyles();

    return (
        <IconButton
            {...props}
            type="button"
            title={props.title}
            ripple={false}
            className={props.checked && !props.disabled ? styles.CheckedButton : undefined}
            onMouseDown={(e) => e.preventDefault()}
        />
    )
}

//Divides logical sections in the menu.
const MenuDivider: React.FunctionComponent<{}> = ({ }) => {
    const styles = useStyles();

    return (
        <div className={styles.Divider} />
    )
}

interface IAddItemProps {
    extensionInfo?: IExtensionInfo
    state: EditorState,
    dispatch: (tr: Transaction<any>) => void,
    onClose: () => any,
    media: IMedium[],
    onMediumAdd: (m: IMedium) => any
}

const AddExtensionDialog: React.FC<IAddItemProps> = ({ extensionInfo, state, media, onMediumAdd, dispatch, onClose }) => {
    if (!!extensionInfo) {
        const { type, props, mediaIds } = extensionInfo;
        const Dialog = dialogs.get(type);

    if (!Dialog) {
        console.error(`Could not find dialog with type ${extensionInfo.type}.`)
        return null;
    }

    try {
        const parsedProps = props ? JSON.parse(props) : undefined
        const parsedMediaIds = mediaIds ? JSON.parse(mediaIds) : []
        return (
            <Dialog 
                open={!!extensionInfo} 
                props={parsedProps} 
                allMedia={media}
                mediaIds={parsedMediaIds} 
                onMediumAdd={onMediumAdd} 
                onSubmit={(e) => {
                    onClose()
                    if (e !== null) {
                        insertNode(schema.node(schema.nodes.article_extension, {
                            type,
                            props: JSON.stringify(e.props ?? null),
                            media: JSON.stringify(e.media ?? null)
                        }))(state, dispatch)
                    }
                }} 
            />
        )
    }
    catch(e) {
        console.error(`Failed to parse props ${props} and/or media ${mediaIds} for type ${type}`);
        return null;
    }
    }
    else return null;
}

interface IExtensionInfo {
    type: string, 
    props?: string,
    mediaIds?: string
}
