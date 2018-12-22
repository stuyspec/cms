import * as React from 'react';
import { connect } from 'react-redux';

import { Redirect } from 'react-router-dom';

import { Elevation } from '@rmwc/elevation';
import { Typography } from '@rmwc/typography';
import { TextField } from '@rmwc/textfield';
import { Button } from '@rmwc/button';

import { IState } from '../../state';
import { signIn } from '../actions';

import './SignInPage.css';

const initialState = {
    email: "",
    password: "",
    error: "",
}

type State = Readonly<typeof initialState>;

class SignInPageUnconnected extends React.Component<any, State> {
    public readonly state: State = initialState;

    public readonly onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        signIn(this.props.dispatch, this.state);
    }

    public readonly onEmailChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            email: e.currentTarget.value
        })
    }

    public readonly onPasswordChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            password: e.currentTarget.value
        })
    }

    public render() {
        if (this.props.session) {
            return <Redirect to={this.props.redirect || "/home"} />
        }
        return (
            <div className='Elevation-container'>
                <Elevation z={8} className='Elevation' onSubmit={this.onSubmit}>
                    <form className='Elevation-inner'>
                        <Typography use="headline3" className='Header'>Sign In</Typography>
                        <TextField
                            label="Email"
                            spellCheck={false}
                            value={this.state.email}
                            onChange={this.onEmailChange}
                            className='Field'
                        />
                        <TextField
                            label="Password"
                            spellCheck={false}
                            type="password"
                            value={this.state.password}
                            onChange={this.onPasswordChange}
                            className='Field'
                        />
                        <Button raised={true} className='Button'>Sign in</Button>
                    </form>
                </Elevation>
            </div>
        )
    }
}

function mapStateToProps(state: IState) {
    return {
        session: state.accounts.session
    }
}

export const SignInPage = connect(mapStateToProps, null)(SignInPageUnconnected);