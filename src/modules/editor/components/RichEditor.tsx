import * as React from 'react';
import './RichEditor.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { MenuBar } from './helpers/MenuBar';
import { Extension } from './extensions/Extension';

interface IProps {
    editorState: EditorState,
    onEditorState: (state: EditorState) => any,
}

const defaultState = {
    editorView: null as EditorView | null
}

//wraps the raw Prosemirror DOM API for use from React
export class RichEditor extends React.Component<IProps, typeof defaultState> {
    constructor(props: IProps) {
        super(props);

        this.state = defaultState;
    }

    public render() {
        const editor = document.getElementById("RichEditorId");
        const extensions = [];
        
        if (editor) {
            const extensionElements = editor.getElementsByTagName("article-extension");
            if (extensionElements) {
                for (let i = 0; i < extensionElements.length; i++) {
                    const type = extensionElements[i].getAttribute("type");
                    const props = extensionElements[i].getAttribute("props");
                    if (type && props) {
                        extensions.push(
                            <Extension
                                type={type}
                                props={props}
                                root={extensionElements[i]}
                            />
                        )
                    }
                }
            }
        }

        // Render just an empty div which is then used as a container for an
        // EditorView instance.
        return (
            <div>
                {this.state.editorView != null ? <MenuBar editorView={this.state.editorView} /> : null}
                <div ref={this.createEditorView} className="RichEditor" id="RichEditorId" />
                {extensions}
            </div>
        );
    }

    public focus() {
        if (this.state.editorView) {
            this.state.editorView.focus();
        }
    }

    public componentDidUpdate(prevProps: Readonly<IProps>) {
        // In case we receive new EditorState through props — we apply it to the
        // EditorView instance.
        if (this.state.editorView) {
            if (prevProps.editorState !== this.props.editorState) {
                this.state.editorView.updateState(this.props.editorState);
            }
        }
    }

    public componentWillUnmount() {
        if (this.state.editorView) {
            this.state.editorView.destroy();
        }
    }

    // public shouldComponentUpdate(_nextProps: IProps, nextState: typeof defaultState) {
    //     // Note that EditorView manages its DOM itself so we'd rather not mess
    //     // with it.

    //     //if the editorView is created, re-render to show menu bar
    //     return this.state.editorView != nextState.editorView;
    // }

    private createEditorView = (element: HTMLDivElement | null): any => {
        if (element !== null) {
            this.setState({
                editorView: new EditorView(element, {
                    state: this.props.editorState,
                    dispatchTransaction: this.dispatchTransaction,
                })
            })
        }
    };

    private dispatchTransaction = (tx: any) => {
        // In case EditorView makes any modification to a state we funnel those
        // modifications up to the parent and apply to the EditorView itself.
        const editorState = this.props.editorState.apply(tx);
        if (this.state.editorView != null) {
            this.state.editorView.updateState(editorState);
        }
        this.props.onEditorState(editorState);
    };

}