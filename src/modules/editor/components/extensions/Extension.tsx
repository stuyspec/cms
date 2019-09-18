import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { extensions, IExtensionProps } from '@stuyspec/article_extensions';
import { createUseStyles } from 'react-jss';

export interface IExtensionProps {
    props: any,
}

type IHelperProps = {
    type: string,
    props: string,
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

const ExtensionHelper: React.FC<IHelperProps> = ({ type, props, ...rest }) => {
    const styles = useStyles();

    let propsObj;
    try {
        propsObj = JSON.parse(props);
    }
    catch (e) {
        console.error(`Unable to parse props "${props}" in article extension of type ${type} (in Extension).`)
        return null;
    }

    const allExtensions = new Map(extensions)
    const SelectedExtension = allExtensions.get(type);
    if (SelectedExtension) {
        return (
            <div className={styles.ExtensionContainer}>
                <div className={styles.Extension}>
                    <SelectedExtension props={propsObj} {...rest} />
                </div>
            </div>
        )
    }
    else {
        console.error(`No article extension available for type ${type} (in Extension).`)
        return null;
    }
}

type IProps = {
    type: string,
    props: string,
    root: Element,
};

export function Extension({ root, ...rest }: IProps) {
    return ReactDOM.createPortal(<ExtensionHelper {...rest} />, root);
}