import * as React from 'react';
import './ArticleForm.css';

import { EditorState } from "prosemirror-state";

import { RichEditor } from "./RichEditor";

import { NumberField } from './helpers/NumberField';
import { FocusField } from './helpers/FocusField';
import { ContributorsField } from './helpers/ContributorsField';
import { SectionField } from './helpers/SectionField';
import { DateField } from './helpers/DateField';
import { FeaturedMediaField } from './helpers/FeaturedMediaField';

import { Button } from '@rmwc/button';
import { IMedium } from '../queryHelpers';

interface IState {
    title: string,
    volume: string,
    issue: string,
    section: string,
    focus: string,
    contributors: string[],
    date: string,
    media: IMedium[],
    editorState: EditorState,
}

interface IProps {
    initialState: IState
    onPost: (state: IState) => any,
    postLabel: string,
    allowBackdate: boolean
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
                sortByFeatured(this.state.media)
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
                    <SectionField
                        value={this.state.section}
                        onChange={this.handleSectionChange}
                    />
                    <FocusField
                        value={this.state.focus}
                        onChange={this.handleFocusChange}
                        label="Focus sentence"
                    />
                    <DateField
                        display={this.props.allowBackdate}
                        value={this.state.date}
                        onChange={this.handleDateChange}
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

    private handleSectionChange = (section: string) => {
        this.setState({
            section
        })
    }

    private handleFocusChange = (focus: string) => {
        this.setState({
            focus
        })
    }

    private handleDateChange = (date: string) => {
        this.setState({
            date
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
const sortByFeatured = (media: IMedium[]) => {
    media.sort(sortByFeaturedSorter)
}

const sortByFeaturedSorter = (a: IMedium, b: IMedium) => {
    if (a.is_featured == b.is_featured) {
        return 0;
    }
    return a.is_featured ? 1 : -1;
}