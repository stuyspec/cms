import React from 'react';
import { createUseStyles } from 'react-jss';
import { SimpleDialog, DialogButton } from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import { Switch } from '@rmwc/switch';
import { DataTable, DataTableContent, DataTableHead, DataTableRow, DataTableHeadCell, DataTableBody, DataTableCell } from '@rmwc/data-table';

import { IProps } from '@stuyspec/article_extensions/dist/LineChartExtension';
import { IExtensionDialogProps } from './dialogs';
import { IconButton } from '@rmwc/icon-button';

const useStyles = createUseStyles({
    TextFieldContainer: {
        display: "flex",
        flexDirection: "column",
        paddingTop: "5px"
    },
    TextField: {
        marginTop: "5px"
    },
    SwitchContainer: {
        display: "flex",
        flexDirection: "column"
    },
    Switch: {
        marginTop: "5px"
    }
})

export const LineChartDialog: React.FC<IExtensionDialogProps> = ({ props, open, onSubmit }) => {
    const styles = useStyles();
    const parsedProps: IProps = props ? props : {};

    const [title, setTitle] = React.useState(parsedProps.title || "");
    const [caption, setCaption] = React.useState(parsedProps.caption || "");
    const [xAxis, setXAxis] = React.useState(parsedProps.xAxisLabel || "");
    const [yAxis, setYAxis] = React.useState(parsedProps.yAxisLabel || "");

    const [showArea, setShowArea] = React.useState(parsedProps.chartOptions ? parsedProps.chartOptions.showArea || false : false)
    const [smoothCurves, setSmoothCurves] = React.useState(parsedProps.chartOptions ? parsedProps.chartOptions.smoothCurves || false : false)

    const [labels] = React.useState(parsedProps.data ? parsedProps.data.labels || [""] : [""])

    const initialDataset = [{
        label: "",
        data: [NaN]
    }]

    const [datasets] = React.useState(parsedProps.data ? parsedProps.data.datasets || initialDataset : initialDataset)

    //used to avoid recreating labels and datasets so React can rerender the component.
    const [_, _setToggleRerender] = React.useState(false);
    const toggleRerender = () => _setToggleRerender(val => !val)

    return (
        <SimpleDialog
            open={open}
            title="Line Chart"
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
                        caption,
                        data: {
                            labels,
                            datasets: resultDatasets
                        },
                        chartOptions: {
                            showArea,
                            smoothCurves
                        }
                    }
                    onSubmit(data)
                }
                else {
                    onSubmit(null)
                }
            }}
        >
            {!open || (
                <>
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
                            value={caption}
                            onChange={(e) => setCaption(e.currentTarget.value)}
                            outlined={true}
                            label="Caption"
                            className={styles.TextField}
                            autoComplete="none"
                        />
                        <TextField
                            value={xAxis}
                            onChange={(e) => setXAxis(e.currentTarget.value)}
                            outlined={true}
                            label="X Axis"
                            className={styles.TextField}
                        />
                        <TextField
                            value={yAxis}
                            onChange={(e) => setYAxis(e.currentTarget.value)}
                            outlined={true}
                            label="Y Axis"
                            className={styles.TextField}
                        />
                    </div>

                    <div className={styles.SwitchContainer}>
                        <Switch
                            label="Show area"
                            checked={showArea}
                            onChange={(e) => setShowArea(e.currentTarget.checked)}
                            className={styles.Switch}
                        />
                        <Switch
                            label="Curve lines"
                            checked={smoothCurves}
                            onChange={(e) => setSmoothCurves(e.currentTarget.checked)}
                            className={styles.Switch}
                        />
                    </div>

                    <DataTable>
                        <DataTableContent>
                            <DataTableHead>
                                <DataTableRow>
                                    <DataTableHeadCell>Labels</DataTableHeadCell>
                                    {
                                        datasets.map((d, index) =>
                                            (
                                                <DataTableHeadCell key={index} alignEnd={true}>
                                                    <TextField
                                                        placeholder={`Series ${index + 1}`}
                                                        trailingIcon={{
                                                            icon: "delete", title: "Delete series", onClick: () => {
                                                                if (window.confirm("Are you sure you want to remove this series and its data?")) {
                                                                    datasets.splice(index, 1);
                                                                    toggleRerender();
                                                                }
                                                            }
                                                        }}
                                                        value={d.label}
                                                        onChange={e => {
                                                            datasets[index].label = e.currentTarget.value; toggleRerender()
                                                        }}
                                                    />
                                                </DataTableHeadCell>
                                            )
                                        )
                                    }
                                    <DataTableHeadCell>
                                        <IconButton icon="add" title="New series" onClick={() => {
                                            datasets.push({
                                                label: "",
                                                data: []
                                            });
                                            toggleRerender();
                                        }}
                                        />
                                    </DataTableHeadCell>
                                </DataTableRow>
                            </DataTableHead>
                            <DataTableBody>
                                {
                                    labels.map((l, index) => (
                                        <DataTableRow key={index}>
                                            <DataTableCell>
                                                <TextField
                                                    placeholder={`Label ${index + 1}`} 
                                                    value={l}
                                                    trailingIcon={{
                                                        icon: "delete",
                                                        title: "Delete label",
                                                        onClick: () => {
                                                            if(window.confirm("Are you sure you want to delete this label and its data?")) {
                                                                labels.splice(index, 1);
                                                                datasets.forEach(d => {
                                                                    d.data.splice(index, 1);
                                                                })
                                                                toggleRerender();
                                                            }
                                                        }
                                                    }}
                                                    onChange={e => {
                                                        labels[index] = e.currentTarget.value; toggleRerender()
                                                    }}
                                                />
                                            </DataTableCell>
                                            {
                                                datasets.map((d, dIndex) => (
                                                    <DataTableCell key={dIndex} >
                                                        <TextField type="number" value={d.data[index]} onChange={e => {
                                                            datasets[dIndex].data[index] = e.currentTarget.value;
                                                            toggleRerender()
                                                        }}
                                                        />
                                                    </DataTableCell>
                                                ))
                                            }
                                        </DataTableRow>
                                    ))
                                }
                                <DataTableRow>
                                    <DataTableCell>
                                        <IconButton icon="add" title="New label" onClick={() => {
                                            labels.push("");
                                            datasets.forEach((d) => {
                                                d.data.push(NaN)
                                            });
                                            toggleRerender();
                                        }}
                                        />
                                    </DataTableCell>
                                </DataTableRow>
                            </DataTableBody>
                        </DataTableContent>
                    </DataTable>
                </>
            )
            }
        </SimpleDialog>
    )

}

