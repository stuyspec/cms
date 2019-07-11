import * as React from 'react';
import './ArticleForm.css';

import { EditorState } from "prosemirror-state";

import { RichEditor } from "./RichEditor";

import { NumberField } from './helpers/NumberField';
import { FocusField } from './helpers/FocusField';
import { ContributorsField } from './helpers/ContributorsField';
import { SectionField } from './helpers/SectionField';

import { Button } from '@rmwc/button';
import { initialState } from '../../state';

interface IState {
    title: string,
    volume: string,
    issue: string,
    section: string,
    focus: string,
    contributors: string[],
    editorState: EditorState
}

interface IProps {
    initialState: IState
    onPost: (state: IState) => any,
    postLabel: string
}

//renders the form fields and buttons necessary for creating/editing article data.
//base for Create/EditArticleForm
export class ArticleFormBase extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props);
        this.state = props.initialState;
    }

    public render() {
        return (

            <form onSubmit={(e) => {
                e.preventDefault();
                this.props.onPost(this.state); 
            }}>
                <button disabled={true} className="ArticleFormDisableAutoSubmitButton" type="submit">Hidden button to disable implicit submit</button>
                <div>
                    <FocusField
                        value={this.state.title}
                        onChange={this.onTitleChange}
                        label="Title"
                        required={true}
                    />
                    <div className="ArticleFormHorizontal">
                        <NumberField
                            value={this.state.volume}
                            onChange={this.onVolumeChange}
                            label="Volume"
                            required={true}
                        />
                        <NumberField
                            value={this.state.issue}
                            onChange={this.onIssueChange}
                            label="Issue"
                            required={true}
                        />
                    </div>
                    <SectionField
                        value={this.state.section}
                        onChange={this.onSectionChange}
                    />
                    <FocusField
                        value={this.state.focus}
                        onChange={this.onFocusChange}
                        label="Focus sentence"

                    />
                    <ContributorsField value={this.state.contributors} onChange={this.onContributorsChange} />
                    <div className="ArticleFormCenter">
                        <RichEditor
                            editorState={this.state.editorState}
                            onEditorState={this.onEditorChange}
                        />
                    </div>
                </div>
                <Button>
                    {this.props.postLabel}
                </Button>
            </form>
        )
    }

    private onTitleChange = (title: string) => {
        this.setState({
            title
        })
    }

    private onVolumeChange = (volume: string) => {
        this.setState({
            volume
        })
    }

    private onIssueChange = (issue: string) => {
        this.setState({
            issue
        })
    }

    private onSectionChange = (section: string) => {
        this.setState({
            section
        })
    }

    private onFocusChange = (focus: string) => {
        this.setState({
            focus
        })
    }

    private onContributorsChange = (contributors: string[]) => {
        this.setState({
            contributors
        })
    }

    private onEditorChange = (editorState: EditorState) => {
        this.setState({
            editorState
        })
    }

}