import * as React from 'react';

import { Redirect } from 'react-router';

import { IState } from '../../state';
import { setCreateArticleSucceeded } from '../actions';
import { setUpdateArticleSucceeded } from '../actions';

import { connect } from 'react-redux';

const FormStateUnconnected: React.SFC<any> = (props) => {
    if (props.createArticleSucceeded || props.updateArticleSucceeded) {
        return <Redirect to="/" push={true} />
    }
    return <></>
}

function mapStateToProps(state: IState) {
    return {
        createArticleSucceeded: state.editor.createArticleSucceeded,
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const FormStateNotification = connect(mapStateToProps, null)(FormStateUnconnected);
