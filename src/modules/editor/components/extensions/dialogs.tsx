import React from 'react';

export interface IExtensionDialogProps {
    props?: any,
    onSubmit: (props: any | null) => any,
    open: boolean
}

import { LineChartDialog } from './LineChartDialog';
import { BarChartDialog } from './BarChartDialog';
import { PieChartDialog } from './PieChartDialog'

export const dialogs = new Map<string, React.ComponentType<IExtensionDialogProps>>([
    ["LineChartExtension", LineChartDialog],
    ["BarChartExtension", BarChartDialog],
    ["PieChartExtension", PieChartDialog]
]);