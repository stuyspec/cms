import * as React from 'react';

import { NameField } from './helpers/NameField';
import { EmailField } from './helpers/EmailField';
import { PasswordField } from './helpers/PasswordField';
import { ProfilePictureField } from './helpers/ProfilePictureField';

import { Button } from '@rmwc/button';

interface IState {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    profile_picture: string,
}

interface IProps {
    initialState: IState
    onPost: (state: IState) => any,
    postLabel: string
}

export class UserFormBase extends React.Component<IProps, IState> {
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
                <button disabled={true} className="UserFormDisableAutoSubmitButton" type="submit">Hidden button to disable implicit submit</button>
                <div>
                    <NameField
                        value={this.state.first_name}
                        onChange={this.handleFirstNameChange}
                        label="First Name"
                        required={true}
                    />
                    <NameField
                        value={this.state.last_name}
                        onChange={this.handleLastNameChange}
                        label="Last Name"
                        required={true}
                    />
                    <EmailField
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        label="Email"
                        required={true}
                    />
                    <PasswordField
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        label="Temporary Password"
                        required={true}
                    />
                    <ProfilePictureField
                        value={this.state.profile_picture}
                        onPFPChange={this.handlePFPChange}
                    />
                </div>
                <Button>
                    {this.props.postLabel}
                </Button>
            </form>
        )
    }

    private handleFirstNameChange = (first_name: string) => {
        this.setState({
            first_name
        })
    }
    private handleLastNameChange = (last_name: string) => {
        this.setState({
            last_name
        })
    }
    private handleEmailChange = (email: string) => {
        this.setState({
            email
        })
    }
    private handlePasswordChange = (password: string) => {
        this.setState({
            password
        })
    }
    private handlePFPChange = (profile_picture: string) => {
        this.setState({
            profile_picture
        })
    }
}
