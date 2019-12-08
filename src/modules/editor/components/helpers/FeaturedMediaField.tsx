import React from 'react';
import './EditorHelpers.css';

import { Typography } from '@rmwc/typography';
import { IconButton } from '@rmwc/icon-button';

import { MediaExtensionDialog } from '../extensions/MediaExtensionDialog';
import { extensions } from '@stuyspec/article_extensions'
import { IMedium } from '../../queryHelpers';
import { createUseStyles } from 'react-jss';

const MediaExtension = extensions.get('MediaExtension')!;

interface IProps {
    media: IMedium[],
    onMediumAdd: (m: IMedium) => any
}

const styles = {
    Vertical: {
        display: 'flex',
        flexDirection: 'column'
    },
    Media: {
        objectFit: 'contain',
        maxWidth: '400px'
    }
}

const useStyles = createUseStyles(styles);

export const FeaturedMediaField: React.FC<IProps> = ({ media, onMediumAdd }) => {
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();

    const featuredMedia = media.filter(m => m.is_featured);

    return (
        <div className={`${classes.Vertical} EditorField`}>
            <Typography use="caption">Media</Typography>
            <div>
                <div className={classes.Media}>
                    <MediaExtension props={{}} media={featuredMedia} />
                </div>
                <IconButton icon="edit" type="button" onClick={() => setOpen(true)} />
            </div>
            {!open || (
                <MediaExtensionDialog
                    allMedia={media}
                    onMediumAdd={onMediumAdd}
                    open={open}
                    onSubmit={(e) => setOpen(false)}
                    isFeatured={true}
                />
            )}
        </div>
    )
}