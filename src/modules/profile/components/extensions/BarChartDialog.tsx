import React from 'react';
import { createUseStyles } from 'react-jss';
import { SimpleDialog } from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import { Switch } from '@rmwc/switch';

import { IProps } from '@stuyspec/article_extensions/dist/BarChartExtension';

import { ChartDataEditor, numToString, stringToNum } from './helpers/ChartDataEditor';
import { IExtensionDialogProps } from './dialogs';

const useStyles = createUseStyles({
    TextFieldContainer: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "5px"
    },
    TextField: {
        marginTop: "7.5px"
    },
    SwitchContainer: {
        display: "flex",
        flexDirection: "column"
    },
    Switch: {
        marginTop: "5px"
    },
    YAxisSettings: {
        paddingTop: "5px",
        display: "flex",
        flexDirection: "row"
    }
})

export const BarChartDialog: React.FC<IExtensionDialogProps> = ({ props, open, onSubmit }) => {
    const styles = useStyles();
    const parsedProps: IProps = props ? props : {};

    const [title, setTitle] = React.useState(parsedProps.title || "");
    const [xAxisLabel, setXAxisLabel] = React.useState(parsedProps.xAxisLabel || "");
    const [yAxisLabel, setYAxisLabel] = React.useState(parsedProps.yAxisLabel || "");

    const [yAxisMin, setYAxisMin] = React.useState(parsedProps.yAxisMin)
    const [yAxisMax, setYAxisMax] = React.useState(parsedProps.yAxisMax)
    const [yAxisStep, setYAxisStep] = React.useState(parsedProps.yAxisStep)

    const [labels] = React.useState(parsedProps.data ? parsedProps.data.labels || [""] : [""])

    const initialDataset = [{
        label: "",
        data: [NaN]
    }]

    const [datasets] = React.useState(parsedProps.data ? parsedProps.data.datasets || initialDataset : initialDataset)

    //used to avoid recreating labels and datasets so React can rerender the component.
    const [, _setToggleRerender] = React.useState(false);
    const triggerRerender = () => _setToggleRerender(val => !val)

    return (
        <SimpleDialog
            open={open}
            title="Bar Chart"
            acceptLabel={props ? "Edit" : "Create"}
            cancelLabel="Cancel"
            onClose={e => {
                console.log(e)
                if (e.detail.action === "accept") {
                    const resultDatasets = datasets as any[];
                    resultDatasets.forEach((d) => {
                        for (let i = 0; i < d.data.length; i++) {
                            d.data[i] = parseFloat(d.data[i])
                        }
                    })
                    const data: IProps = {
                        title,
                        xAxisLabel,
                        yAxisLabel,
                        yAxisMin,
                        yAxisMax,
                        yAxisStep,
                        data: {
                            labels,
                            datasets: resultDatasets
                        },
                    }
                    onSubmit({props: data})
                }
                else {
                    onSubmit(null)
                }
            }}
        >

            <div className={styles.TextFieldContainer}>
                <TextField
                    value={title}
                    onChange={(e) => setTitle(e.currentTarget.value)}
                    outlined={true}
                    label="Title"
                    className={styles.TextField}
                    autoComplete="none"
                />
                <TextField
                    value={xAxisLabel}
                    onChange={(e) => setXAxisLabel(e.currentTarget.value)}
                    outlined={true}
                    label="X Axis"
                    className={styles.TextField}
                />
                <TextField
                    value={yAxisLabel}
                    onChange={(e) => setYAxisLabel(e.currentTarget.value)}
                    outlined={true}
                    label="Y Axis"
                    className={styles.TextField}
                />
                <div className={styles.YAxisSettings}>
                    <TextField
                        type="number"
                        value={numToString(yAxisMin)}
                        onChange={(e) => setYAxisMin(stringToNum(e.currentTarget.value))}
                        outlined={true}
                        label="Y Axis min value"
                    />
                    <TextField
                        type="number"
                        value={numToString(yAxisMax)}
                        onChange={(e) => setYAxisMax(stringToNum(e.currentTarget.value))}
                        outlined={true}
                        label="Y Axis max value"
                    />
                    <TextField
                        type="number"
                        value={numToString(yAxisStep)}
                        onChange={(e) => setYAxisStep(stringToNum(e.currentTarget.value))}
                        outlined={true}
                        label="Y Axis step"
                    />
                </div>
            </div>
            <ChartDataEditor datasets={datasets} labels={labels} triggerRerender={triggerRerender} />
        </SimpleDialog>
    )

}

