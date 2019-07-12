import * as React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from '@rmwc/dialog'
import { TextField } from '@rmwc/textfield';

interface IProps {
    //Whether the dialog is currently being displayed
    open: boolean,
    //When the dialog is closed. If the callback is provided with null,
    //the user cancelled or hit close. Otherwise, the callback is provided
    //with the text and href entered by the user.
    onClose: (result: { href: string } | null) => any,
    // //The initial, selected text.
    // initialText: string,
    //The initial link provided by the creator. May be an empty string.
    initialHref: string
}

export const LinkDialog: React.FunctionComponent<IProps> = ({ open, onClose, initialHref }) => {
    //const [text, setText] = React.useState(initialText);
    const [href, setHref] = React.useState(initialHref);

    return (
        <Dialog
            open={open}
            onClose={e => {
                if(e.detail.action && e.detail.action == "accept") {
                    onClose({ href });
                }
                else onClose(null);
                setHref("");
            }}
        >
            <DialogTitle>Insert Link</DialogTitle>
            <DialogContent>
                <TextField
                    label="Link"
                    value={href}
                    onChange={(e) => setHref(e.currentTarget.value)}
                    outlined={true}
                    className="LinkDialogTextBox"
                />
            </DialogContent>
            <DialogActions>
                <DialogButton action="cancel" type="button">Cancel</DialogButton>
                <DialogButton action="accept" type="button" raised={true} disabled={href.length == 0}>Insert</DialogButton>
            </DialogActions>
        </Dialog>
    )
}