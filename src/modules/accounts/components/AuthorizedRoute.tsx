import * as React from 'react';

import { Route, Redirect, RouteComponentProps } from 'react-router';

import { connect } from 'react-redux';
import { validateToken } from '../actions';

import { PermissionLevel } from '../permissionLevel';
import { IState } from '../../state';
import { IAccountsSession } from '../state';

interface IProps {
    component?: React.ComponentType<any>,
    render?: ((props: RouteComponentProps<any>) => React.ReactNode),
    auth: PermissionLevel,
    path: string,
    key: string,
    exact?: boolean,
    session: IAccountsSession | null,
    dispatch: any
}

class AuthorizedRouteUnconnected extends React.Component<IProps, {}> {
    constructor(props: IProps) {
        super(props);
        if(props.session) {
            validateToken(props.dispatch, props.session)
        }
    }

    render() {
        if (this.props.session) {
            return <Route
                component={this.props.component}
                render={this.props.render}
                path={this.props.path}
                key={this.props.key}
                exact={this.props.exact}
            />;
        }
        return <Redirect to="/sign-in" />;
    }
}

const mapStateToProps = (state: IState) => {
    return {
        session: state.accounts.session
    }
}

export const AuthorizedRoute = connect(
    mapStateToProps
)(AuthorizedRouteUnconnected);