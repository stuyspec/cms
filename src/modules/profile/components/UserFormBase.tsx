import * as React from 'react';
import "./UserForm.css"

import { NameField } from './helpers/NameField';
import { EmailField } from './helpers/EmailField';
import { PasswordField } from './helpers/PasswordField';
import { RoleField } from './helpers/RoleField';
import { ProfilePictureField } from './helpers/ProfilePictureField';

import { Button } from '@rmwc/button';

interface IState {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    profile_pic_url: string,
    role: string,
    isCreate: boolean,
    profile_picture_b64: string
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
        let password = this.state.isCreate &&
                    <div>
                        <PasswordField
                            value={this.state.password}
                            onChange={this.handlePasswordChange}
                            label="Temporary Password"
                            required={this.state.isCreate}
                        /> 
                        <br/>
                    </div>;
        return (
            <form onSubmit={(e) => {
                e.preventDefault();
                this.props.onPost(this.state);
            }} autoComplete="false">
                <button disabled={true} className="UserFormDisableAutoSubmitButton" type="submit">Hidden button to disable implicit submit</button>
                <div>
                    <NameField
                        value={this.state.first_name}
                        onChange={this.handleFirstNameChange}
                        label="First Name"
                        required={true}
                    />
                    <br/>
                    <NameField
                        value={this.state.last_name}
                        onChange={this.handleLastNameChange}
                        label="Last Name"
                        required={true}
                    />
                    <br/>
                    <EmailField
                        value={this.state.email}
                        onChange={this.handleEmailChange}
                        label="Email"
                        required={true}
                    />
                    <br/>
                    {password}
                    <RoleField
                        role={this.state.role}
                        onChange={this.handleRoleChange}
                        label="Role"
                        required={this.state.isCreate}
                    />
                    <br/>
                    <img 
                        style={{marginLeft: "20px", marginTop:"5px"}} 
                        src={this.state.profile_picture_b64 || 
                            this.state.profile_pic_url}
                        height={200}
                    />
                    <br/>
                    <ProfilePictureField
                        onPFPChange={this.handlePFPChange}
                        onPFPURLChange={this.handlePFPURLChange}
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
    private handleRoleChange = (role: string) => {
        this.setState({
            role
        })
    }
    private handlePFPChange = (profile_picture_b64: string) => {
        this.setState({
            profile_picture_b64
        })
    }
    private handlePFPURLChange = (profile_pic_url: string) => {
        this.setState({
            profile_pic_url
        })
    }
}
