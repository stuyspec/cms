import * as React from 'react';
import './RichEditor.css';

import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { MenuBar } from './helpers/MenuBar';

interface IProps {
    editorState: EditorState,
    onEditorState: (state: EditorState) => any,
}

//wraps the raw Prosemirror DOM API for use from React
export class RichEditor extends React.Component<IProps> {
    private editorView?: EditorView;

    public render() {
        // Render just an empty div which is then used as a container for an
        // EditorView instance.
        return (
            <div>
                <MenuBar editorState={this.props.editorState} />
                <div ref={this.createEditorView} className="RichEditor" />
            </div>
        );
    }

    public focus() {
        if (this.editorView) {
            this.editorView.focus();
        }
    }

    public componentWillReceiveProps(nextProps: Readonly<IProps>) {
        // In case we receive new EditorState through props — we apply it to the
        // EditorView instance.
        if (this.editorView) {
            if (nextProps.editorState !== this.props.editorState) {
                this.editorView.updateState(nextProps.editorState);
            }
        }
    }

    public componentWillUnmount() {
        if (this.editorView) {
            this.editorView.destroy();
        }
    }

    public shouldComponentUpdate() {
        // Note that EditorView manages its DOM itself so we'd ratrher don't mess
        // with it.
        return false;
    }

    private createEditorView = (element: HTMLDivElement | null): any => {
        if (element !== null) {
            this.editorView = new EditorView(element, {
                state: this.props.editorState,
                dispatchTransaction: this.dispatchTransaction,
            });
        }
    };

    private dispatchTransaction = (tx: any) => {
        // In case EditorView makes any modification to a state we funnel those
        // modifications up to the parent and apply to the EditorView itself.
        const editorState = this.props.editorState.apply(tx);
        if (this.editorView != null) {
            this.editorView.updateState(editorState);
        }
        this.props.onEditorState(editorState);
    };



}