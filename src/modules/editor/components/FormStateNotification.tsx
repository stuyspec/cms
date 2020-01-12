import * as React from 'react';

import { Redirect } from 'react-router';

import { IState } from '../../state';
import { setCreateArticleSucceeded } from '../actions';
import { setUpdateArticleSucceeded } from '../actions';

import { Snackbar } from '@rmwc/snackbar';

import { connect } from 'react-redux';

import { snackbarQueue } from '../../snackbarQueue';

const FormStateUnconnected: React.SFC<any> = (props) => {
    if (props.createArticleSucceeded || props.updateArticleSucceeded) {
        return <Redirect to="/" push={true} />
    }
    else if (props.createArticleSucceeded === false) {
        snackbarQueue.notify({
            title: 'Failed to publish article',
            onClose: () => props.dispatch(setCreateArticleSucceeded.call(null)),
            timeout: 2000,
        })
    }
    else if (props.updateArticleSucceeded === false) {
        snackbarQueue.notify({
            title: 'Failed to edit article',
            onClose: () => props.dispatch(setCreateArticleSucceeded.call(null)),
            timeout: 2000,
        })
    }
    return (<></>)
}

function mapStateToProps(state: IState) {
    return {
        createArticleSucceeded: state.editor.createArticleSucceeded,
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const FormStateNotification = connect(mapStateToProps, null)(FormStateUnconnected);
