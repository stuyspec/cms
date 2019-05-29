import * as React from 'react';

import { Redirect } from 'react-router';

import { IState } from '../../state';
import { setCreateArticleSucceeded } from '../actions';
import { setUpdateArticleSucceeded } from '../actions';

import { Snackbar } from '@rmwc/snackbar';

import { connect } from 'react-redux';

const FormStateUnconnected: React.SFC<any> = (props) => {
    if (props.createArticleSucceeded || props.updateArticleSucceeded) {
        return <Redirect to="/" push={true} />
    }

    return (
        <>
            <Snackbar
                open={props.createArticleSucceeded === false}
                onClose={() => props.dispatch(setCreateArticleSucceeded.call(null))}
                message="Failed to publish article."
                timeout={2000}
            />
            <Snackbar
                open={props.updateArticleSucceeded === false}
                onClose={() => props.dispatch(setUpdateArticleSucceeded.call(null))}
                message="Failed to edit article."
                timeout={2000}
            />
        </>
    )
}

function mapStateToProps(state: IState) {
    return {
        createArticleSucceeded: state.editor.createArticleSucceeded,
        updateArticleSucceeded: state.editor.updateArticleSucceeded
    }
}

export const FormStateNotification = connect(mapStateToProps, null)(FormStateUnconnected);
