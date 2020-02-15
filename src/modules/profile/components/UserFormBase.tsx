import * as React from 'react';
import './UserForm.css';

import { EditorState } from "prosemirror-state";

import { RichEditor } from "./RichEditor";

import { NumberField } from './helpers/NumberField';
import { FocusField } from './helpers/FocusField';
import { ContributorsField } from './helpers/ContributorsField';
import { SectionField } from './helpers/SectionField';
import { FeaturedMediaField } from './helpers/FeaturedMediaField';

import { Button } from '@rmwc/button';
import { IMedium } from '../queryHelpers';

interface IState {
    first_name: string,
    last_name: string,
    email: string,
    profile_picture: string,
}

interface IProps {
    initialState: IState
    onPost: (state: IState) => any,
    postLabel: string
}

//renders the form fields and buttons necessary for creating/editing user data.
//base for Create/EditUserForm
export class UserFormBase extends React.Component<IProps, IState> {
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
                <button disabled={true} className="UserFormDisableAutoSubmitButton" type="submit">Hidden button to disable implicit submit</button>
                <div>
                    <FocusField
                        value={this.state.title}
                        onChange={this.handleTitleChange}
                        label="Title"
                        required={true}
                    />
                    <div className="UserFormHorizontal">
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
                    <FeaturedMediaField media={this.state.media} onMediumAdd={this.handleMediumChange} />
                    <ContributorsField value={this.state.contributors} onChange={this.handleContributorsChange} />
                    <div className="UserFormCenter">
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
