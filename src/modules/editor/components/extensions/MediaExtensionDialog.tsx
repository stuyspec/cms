import React from 'react';

import { IExtensionDialogProps } from './dialogs';
import { IMedium } from '../../queryHelpers';

import { ContributorChip } from '../../../core/components/ContributorChip';
import { MediumDialog } from './helpers/MediumDialog';

import { Dialog, DialogTitle, DialogContent, DialogActions } from '@rmwc/dialog';
import { Button } from '@rmwc/button';
import { IconButton } from '@rmwc/icon-button';
import { Typography } from '@rmwc/typography';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    previewsContainer: {
        maxWidth: "inherit",
        overflowX: "auto"
    },
    dialogContentDiv: {
        display: "flex",
        flexDirection: "column"
    }
})

interface IAdditionalProps {
    isFeatured?: boolean
}


export const MediaExtensionDialog: React.FC<IExtensionDialogProps & IAdditionalProps> = ({ allMedia, mediaIds, open, onSubmit, onMediumAdd, isFeatured }) => {
    const classes = useStyles();

    const [currentMediaIds, setCurrentMediaIds] = React.useState(mediaIds ?? []);
    const [uploadOpen, setUploadOpen] = React.useState(false);

    const chosenMedia = allMedia.filter(m => currentMediaIds.includes(parseInt(m.id)));

    const handleClose = (e: string) => {
        switch (e) {
            case "cancel":
                onSubmit(null);
                break;
            case "accept":
                onSubmit({ media: currentMediaIds })
                break;
        }
    }

    return (
        <Dialog open={open} preventOutsideDismiss={true}>
            <DialogTitle>Media</DialogTitle>
            <DialogContent>
                <div className={classes.dialogContentDiv}>
                    <div className={classes.previewsContainer}>
                        {chosenMedia.map(m => <MediumPreview medium={m} />)}
                    </div>
                    <IconButton icon="add" type="button" onClick={() => setUploadOpen(true)} />
                </div>
                <MediumDialog isFeatured={isFeatured ?? false} open={uploadOpen} onClose={(medium) => {
                    if (medium) {
                        setCurrentMediaIds(currentMediaIds.concat([parseInt(medium.id)]))
                        onMediumAdd(medium)
                    }
                    setUploadOpen(false)
                }} />
            </DialogContent>
            <DialogActions>
                <Button type="button" onClick={() => { handleClose("cancel") }}>Cancel</Button>
                <Button type="button" onClick={() => { handleClose("accept") }}>{mediaIds ? "Edit" : "Create"}</Button>
            </DialogActions>
        </Dialog>
    )
}



interface IMediumPreviewProps {
    medium: IMedium
}

const usePreviewStyles = createUseStyles({
    container: {
        display: "flex",
        flexDirection: "column"
    },
    image: {
        objectFit: 'contain'
    }
})

const MediumPreview: React.FC<IMediumPreviewProps> = ({ medium }) => {
    const classes = usePreviewStyles();

    return (
        <div className={classes.container}>
            <img src={medium.attachment_url} height={250} className={classes.image} />
            <ContributorChip
                slug={medium.user.slug}
                firstName={medium.user.first_name}
                lastName={medium.user.last_name}
                deletable={false}
            />
            <Typography use="body1">Title: {medium.title}</Typography>
            <Typography use="body1">{medium.caption ? `Caption: ${medium.caption}` : <i>No caption</i>}</Typography>
        </div>
    )
}