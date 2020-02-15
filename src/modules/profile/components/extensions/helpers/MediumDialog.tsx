import * as React from "react";

import { client } from "../../../../apolloClient";
import { queryAccountIDs, IMedium } from "../../../queryHelpers";

import { Dialog, DialogActions, DialogTitle, DialogContent } from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import { Select } from "@rmwc/select";
import { Button } from '@rmwc/button';
import { CircularProgress } from '@rmwc/circular-progress';

import { createUseStyles } from "react-jss";

import { snackbarQueue } from '../../../../snackbarQueue';
import { ContributorsField } from '../../helpers/ContributorsField';
import { CREATE_USER_MUTATION } from '../../../queryHelpers';
import classes from "*.module.css";


interface IVariables {
    first_name: string,
    last_name: number,
    email: string,
    profile_picture: string,
}

interface IData {
    first_name: string
}

const useStyles = createUseStyles({
    DialogForm: {
        display: "flex",
        flexDirection: "column"
    },
    Input: {
        marginTop: "10px"
    },
    UploadButton: {
        display: "flex",
        flexDirection: "row"
    }
})

interface IProps {
    open: boolean,
    onClose: (medium?: IMedium) => any,
    initialData?: IVariables,
    isFeatured: boolean
}

export const MediumDialog: React.FC<IProps> = ({ open, onClose, initialData, isFeatured }) => {
    const styles = useStyles();

    const [file, setFile] = React.useState("");
    const [dataURL, setDataURL] = React.useState(initialData?.attachment_b64 ?? "");
    const [uploading, setUploading] = React.useState(false);

    const reader = new FileReader();
    reader.onloadend = (e) => { setDataURL(reader.result as string) }

    const handleClose = (e: string) => {
        switch (e) {
            case "cancel":
                setTitle("");
                setCaption("");
                setFile("");
                setDataURL("");
                setUploading(false)
                onClose()
                break;
            case "accept":
                setUploading(true)
                queryAccountIDs(contributors, client).then(results => {
                    console.log(`[${results.join(", ")}]`)
                    const controller = new AbortController();
                    const signal = controller.signal;

                    client.mutate<IData, IVariables>({
                        mutation: CREATE_MEDIUM_MUTATION,
                        variables: {
                            title,
                            caption,
                            user_id: results ? results[0] : -1,
                            attachment_b64: dataURL,
                            media_type: imageType,
                            is_featured: isFeatured
                        },
                        context: {
                            fetchOptions: {
                                signal
                            }
                        }
                    }).then(e => {
                        setUploading(false)
                        if (e.data?.createMedium) {
                            snackbarQueue.notify({
                                icon: 'check',
                                body: 'Successfully uploaded medium.',
                                actions: [
                                    { title: 'Dismiss' }
                                ]
                            })
                            console.dir(e.data.createMedium)
                            onClose(e.data.createMedium as IMedium);
                        }
                        else {
                            snackbarQueue.notify({
                                icon: 'error',
                                body: 'Failed to upload medium.',
                                actions: [
                                    { title: 'Dismiss' }
                                ]
                            })
                            onClose();
                        }
                    }).catch(() => {
                        setUploading(false);
                        snackbarQueue.notify({
                            icon: 'error',
                            body: 'Failed to upload medium.',
                            actions: [
                                { title: 'Dismiss' }
                            ]
                        })
                        onClose();
                    })
                })
                break;
        }
    }

    return (
        <Dialog
            open={open}
            preventOutsideDismiss={true}
        >
            <DialogTitle>Upload Image</DialogTitle>
            <DialogContent>
                <div className={styles.DialogForm}>
                    <TextField
                        label="Title"
                        required={true}
                        outlined={true}
                        value={title}
                        onChange={(e) => setTitle(e.currentTarget.value)}
                        className={styles.Input}
                    />
                    <TextField
                        label="Caption"
                        value={caption}
                        outlined={true}
                        onChange={(e) => setCaption(e.currentTarget.value)}
                        className={styles.Input}
                    />
                    <Select
                        label="Type"
                        enhanced={true}
                        outlined={true}
                        value={imageType}
                        required={true}
                        onChange={e => setImageType(e.currentTarget.value)}
                        options={[{ label: "Photo", value: "photo" }, { label: "Art", value: "illustration" }]}
                        className={styles.Input}
                    />
                    <ContributorsField
                        value={contributors}
                        onChange={contributors => setContributors(contributors)}
                        max={1}
                    />
                    <input
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        required={true}
                        value={file}
                        onChange={e => {
                            setFile(e.currentTarget.value);
                            if (e.target.files && e.target.files.length > 0) {
                                if (e.target.files![0].size >= 2500 * 1000) {
                                    snackbarQueue.notify({
                                        icon: 'error',
                                        body: 'Images larger than 2.5MB are not supported.',
                                        actions: [
                                            { title: 'Dismiss' }
                                        ]
                                    })
                                }
                                else reader.readAsDataURL(e.target.files![0])
                            }
                            else setDataURL("");
                        }}
                        className={styles.Input}
                    />
                    {
                        dataURL ? <img src={dataURL} height={200} /> : undefined
                    }
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { handleClose("cancel") }}>Cancel</Button>
                <Button onClick={() => { handleClose("accept") }} disabled={uploading || !(title && dataURL && imageType && contributors[0])}>
                    <div className={styles.UploadButton}>
                        Upload {uploading ? <CircularProgress size="small" /> : null}
                    </div>
                </Button>
            </DialogActions>
        </Dialog>
    )
}
