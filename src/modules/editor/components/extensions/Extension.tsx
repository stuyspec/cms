import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { extensions } from '@stuyspec/article_extensions';
import { createUseStyles } from 'react-jss';

import { IMedium } from '../../queryHelpers';

type IHelperProps =  {
    type: string,
    props: string,
    media?: IMedium[]
};

const useStyles = createUseStyles({
    Extension: {
        width: "60%"
    },
    ExtensionContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // allow outline to be set by Prosemirror
        outline: "inherit",
        width: "100%"
    }
})

export const ExtensionHelper: React.FC<IHelperProps> = ({type, props, media}) => {
    const styles = useStyles();

    let propsObj;
    try {
        propsObj = JSON.parse(props);
    }
    catch(e) {
        console.error(`Unable to parse props "${props}" in article extension of type ${type} (in Extension).`)
        return null;
    }

    const SelectedExtension = extensions.get(type);
    if (SelectedExtension) {
        return (
            <div className={styles.ExtensionContainer}>
                <div className={styles.Extension}>
                    <SelectedExtension props={propsObj} media={media} />
                </div>
            </div>
        )
    }
    else {
        console.error(`No article extension available for type ${type} (in Extension).`)
        return null;
    }
}

interface IProps {
    type: string,
    props: string,
    media?: string,
    allMedia: IMedium[] | null,
    root: Element,
};

export function Extension({root, media, allMedia, type, ...rest}: IProps)  {
    let mediaIds: number[];
    try {
        mediaIds = media ? JSON.parse(media) ?? [] : [];
    }
    catch(e) {
        console.error(`Unable to parse media "${media}" in article extension of type ${type} (in Extension).`)
        return null;
    }

    const mediaObjs = mediaIds.includes && allMedia ? allMedia.filter((m: any) => mediaIds.includes(parseInt(m.id))) : undefined

    return ReactDOM.createPortal(<ExtensionHelper media={mediaObjs} type={type} {...rest} />, root);
}