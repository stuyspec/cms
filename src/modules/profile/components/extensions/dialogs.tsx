import React from 'react';

import { MediaExtensionDialog } from './MediaExtensionDialog';
import { IUserData } from '../../queryHelpers';

interface ISubmit {
    props?: any,
    media?: number
}

export interface IExtensionDialogProps {
    props?: any,

    //ids of media objects currently attached to 
    mediaIds?: number,
    //array of all media objects currently available to article
    allMedia: IUserData,
    onMediumAdd: (m: IUserData) => any
    
    onSubmit: (data: ISubmit | null) => any,
    open: boolean
}

export const dialogs = new Map<string, React.ComponentType<IExtensionDialogProps>>([
    ["MediaExtension", MediaExtensionDialog]
]);
