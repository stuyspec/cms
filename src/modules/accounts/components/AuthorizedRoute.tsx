import * as React from 'react';

import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { PermissionLevel } from '../permissionLevel';
import { IState } from '../../state';

interface IProps {
    component: React.ComponentType<any>,
    auth: PermissionLevel,
    path: string,
    key: string,
    session: boolean
}

const AuthorizedRouteUnconnected: React.SFC<IProps> = (props: IProps) => {
    if(props.session) {
        return <Route component={props.component} path={props.path} key={props.key} />;
    }
    return <Redirect to="/sign-in" />;
}

const mapStateToProps = (state: IState) => {
    return {
        session: !!state.accounts.session
    }
}

export const AuthorizedRoute = connect(
    mapStateToProps,
    null
)(AuthorizedRouteUnconnected);