import * as React from 'react';

import { Redirect } from 'react-router';

import { IState } from '../../state';
import { setCreateUserSucceeded } from '../actions';
import { setUpdateUSerSucceeded } from '../actions';

import { Snackbar } from '@rmwc/snackbar';

import { connect } from 'react-redux';

const FormStateUnconnected: React.SFC<any> = (props) => {
    if (props.createUserSucceeded || props.updateUserSucceeded) {
        return <Redirect to="/" push={true} />
    }

    return (
        <>
            <Snackbar
                open={props.createUserSucceeded === false}
                onClose={() => props.dispatch(setCreateUserSucceeded.call(null))}
                message="Failed to publish article."
                timeout={2000}
            />
            <Snackbar
                open={props.updateUserSucceeded === false}
                onClose={() => props.dispatch(setUpdateUserSucceeded.call(null))}
                message="Failed to edit article."
                timeout={2000}
            />
        </>
    )
}

function mapStateToProps(state: IState) {
    return {
        createUserSucceeded: state.editor.createUserSucceeded,
        updateUserSucceeded: state.editor.updateUserSucceeded
    }
}

export const FormStateNotification = connect(mapStateToProps, null)(FormStateUnconnected);
