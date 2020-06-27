import * as React from 'react';
import './ArticleForm.css';

import { EditorState } from "prosemirror-state";

import { RichEditor } from "./RichEditor";

import { NumberField } from './helpers/NumberField';
import { FocusField } from './helpers/FocusField';
import { ContributorsField } from './helpers/ContributorsField';
import { SectionsField } from './helpers/SectionsField';
import { FeaturedMediaField } from './helpers/FeaturedMediaField';

import { Button } from '@rmwc/button';
import { IMedium } from '../queryHelpers';

interface IState {
    title: string,
    volume: string,
    issue: string,
    sections: string[],
    focus: string,
    contributors: string[],
    media: IMedium[],
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
                sortMediaByFeatured(this.state.media)
                this.props.onPost(this.state); 
            }}>
                <button disabled={true} className="ArticleFormDisableAutoSubmitButton" type="submit">Hidden button to disable implicit submit</button>
                <div>
                    <FocusField
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                        label="Title"
                        required={true}
                    />
                    <div className="ArticleFormHorizontal">
                        <NumberField
                            value={this.state.volume}
                            onChange={this.handleVolumeChange}
                            label="Volume"
                            required={true}
                        />
                        <NumberField
                            value={this.state.issue}
                            onChange={this.handleIssueChange}
                            label="Issue"
                            required={true}
                        />
                    </div>
                    <SectionsField
                        value={this.state.sections}
                        onChange={this.handleSectionsChange}
                    />
                    <FocusField
                        value={this.state.focus}
                        onChange={this.handleFocusChange}
                        label="Focus sentence"
                    />
                    <FeaturedMediaField media={this.state.media} onMediumAdd={this.handleMediumChange} />
                    <ContributorsField value={this.state.contributors} onChange={this.handleContributorsChange} />
                    <div className="ArticleFormCenter">
                        <RichEditor
                            editorState={this.state.editorState}
                            onEditorState={this.handleEditorChange}
                            media={this.state.media}
                            onMediumAdd={this.handleMediumChange}
                        />
                    </div>
                </div>
                <Button>
                    {this.props.postLabel}
                </Button>
            </form>
        )
    }

    private handleTitleChange = (title: string) => {
        this.setState({
            title
        })
    }

    private handleVolumeChange = (volume: string) => {
        this.setState({
            volume
        })
    }

    private handleIssueChange = (issue: string) => {
        this.setState({
            issue
        })
    }

    private handleSectionsChange = (sections: string[]) => {
        console.log(sections);
        this.setState({
            sections
        })
    }

    private handleFocusChange = (focus: string) => {
        this.setState({
            focus
        })
    }

    private handleContributorsChange = (contributors: string[]) => {
        this.setState({
            contributors
        })
    }

    private handleEditorChange = (editorState: EditorState) => {
        this.setState({
            editorState
        })
    }

    private handleMediumChange = (m: IMedium) => {
        this.setState({
            media: this.state.media.concat([m])
        })
    }
}

//used to move featured media to front of media list in sort
//this means featured media will show up on front page first
const sortMediaByFeatured = (media: IMedium[]) => {
    media.sort(sortByFeatured)
}

const sortByFeatured = (a: IMedium, b: IMedium) => {
    if(a.is_featured == b.is_featured) {
        return 0;
    }
    return a.is_featured ? 1 : -1;
}
