import * as React from 'react';

import { Button } from '@rmwc/button';
import { connect } from 'react-redux';
import { setSession } from '../../accounts/actions';
import { Redirect } from 'react-router';

interface IProps {
    dispatch: any
}

const SignOutUnconnected: React.FunctionComponent<IProps> = (props) => {
    const [clicked, setClicked] = React.useState(false);
    if(clicked) {
        return <Redirect to="sign-in" />
    }
    return (
        <Button
            label="Sign Out"
            outlined={true}
            theme={['secondaryBg', 'onSecondary']}
            onClick={() => { props.dispatch(setSession.call(null)); setClicked(true); } }
        />
    )
}

export const SignOutButton = connect(null)(SignOutUnconnected);
