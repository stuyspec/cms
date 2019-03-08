import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

//import { PermissionLevel } from './accounts/permissionLevel';
//import { AuthorizedRoute } from './accounts/components/AuthorizedRoute';
import { withPageLayout } from './core/withPageLayout';

import { SignInPage } from './accounts/components/SignInPage';
import { ArticlesHome } from './core/components/ArticlesHome';

import { CreateArticleForm } from './editor/components/CreateArticleForm';
import { EditArticleForm } from './editor/components/EditArticleForm';

import { NotFound } from './core/components/NotFound';

export const RoutingApp = ({ }) => (
    <BrowserRouter>
        <Switch>
            <Route
                path="/sign-in"
                key="sign-in"
                component={SignInPage}
            />
            <Route
                path="/"
                exact={true}
                key="/"
                component={ArticlesHome}
            />
            <Route
                path="/article/new"
                key="article/new"
                component={CreateArticleForm}
            />
            <Route
                path="/article/edit/:slug"
                key="/article/edit"
                render={({match}) => <EditArticleForm slug={match.params.slug} />}
            />
            <Route
                path="*"
                key="wildcard"
                component={NotFound}
            />
        </Switch>
    </BrowserRouter>
);