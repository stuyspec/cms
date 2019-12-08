import React from 'react';

import { LineChartDialog } from './LineChartDialog';
import { BarChartDialog } from './BarChartDialog';
import { PieChartDialog } from './PieChartDialog'
import { MediaExtensionDialog } from './MediaExtensionDialog';
import { IMedium } from '../../queryHelpers';

interface ISubmit {
    props?: any,
    media?: number[]
}

export interface IExtensionDialogProps {
    props?: any,

    //ids of media objects currently attached to 
    mediaIds?: number[],
    //array of all media objects currently available to article
    allMedia: IMedium[],
    onMediumAdd: (m: IMedium) => any
    
    onSubmit: (data: ISubmit | null) => any,
    open: boolean
}

export const dialogs = new Map<string, React.ComponentType<IExtensionDialogProps>>([
    ["LineChartExtension", LineChartDialog],
    ["BarChartExtension", BarChartDialog],
    ["PieChartExtension", PieChartDialog],
    ["MediaExtension", MediaExtensionDialog]
]);