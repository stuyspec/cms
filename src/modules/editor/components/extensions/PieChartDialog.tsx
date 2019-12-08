import React from 'react';
import { createUseStyles } from 'react-jss';
import { SimpleDialog } from '@rmwc/dialog';
import { TextField } from '@rmwc/textfield';
import { Switch } from '@rmwc/switch';

import { IProps } from '@stuyspec/article_extensions/dist/PieChartExtension';

import { numToString } from './helpers/ChartDataEditor';
import { IExtensionDialogProps } from './dialogs';

import {
    DataTable,
    DataTableContent,
    DataTableBody,
    DataTableHead,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';
import { IconButton } from '@rmwc/icon-button';

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

export const PieChartDialog: React.FC<IExtensionDialogProps> = ({ props, open, onSubmit }) => {
    const styles = useStyles();
    const parsedProps: IProps = props ? props : {};

    const [title, setTitle] = React.useState(parsedProps.title || "");

    const [doughnut, setDoughnut] = React.useState(parsedProps.chartOptions && parsedProps.chartOptions.doughnut || false)

    const initialData = [{ label: "", data: NaN }]

    const [data] = React.useState(parsedProps.data || initialData)

    //used to avoid recreating labels and datasets so React can rerender the component.
    const [, _setToggleRerender] = React.useState(false);
    const triggerRerender = () => _setToggleRerender(val => !val)

    return (
        <SimpleDialog
            open={open}
            title="Pie Chart"
            acceptLabel={props ? "Edit" : "Create"}
            cancelLabel="Cancel"
            onClose={e => {
                console.log(e)
                if (e.detail.action === "accept") {
                    const props: IProps = {
                        data,
                        title,
                        chartOptions: {
                            doughnut
                        }
                    }
                    onSubmit({props})
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
            </div>
            <Switch
                label="Doughnut"
                checked={doughnut}
                onChange={e => setDoughnut(e.currentTarget.checked)}
                className={styles.Switch}
            />

            <DataTable>
                <DataTableContent>
                    <DataTableHead>
                        <DataTableRow>
                            <DataTableHeadCell>Labels</DataTableHeadCell>
                            <DataTableHeadCell alignEnd={true}>Data</DataTableHeadCell>
                        </DataTableRow>
                    </DataTableHead>
                    <DataTableBody>
                        {
                            data.map((d, index) => (
                                <DataTableRow key={index}>
                                    <DataTableCell>
                                        <TextField
                                            placeholder={`Label ${index + 1}`}
                                            required={true}
                                            value={d.label}
                                            onChange={(e) => {
                                                data[index].label = e.currentTarget.value
                                                triggerRerender()
                                            }}
                                            trailingIcon={{
                                                icon: "delete",
                                                title: "Delete label",
                                                type: "button",
                                                onClick: () => {
                                                    if (window.confirm("Are you sure you want to delete this label and its data?")) {
                                                        data.splice(index, 1);
                                                        triggerRerender();
                                                    }
                                                }
                                            }}
                                        />
                                    </DataTableCell>
                                    <DataTableCell alignEnd={true}>
                                        <TextField
                                            type="number"
                                            required={true}
                                            value={numToString(d.data)}
                                            onChange={(e) => {
                                                data[index].data = parseFloat(e.currentTarget.value)
                                                triggerRerender()
                                            }}
                                        />
                                    </DataTableCell>
                                </DataTableRow>
                            ))
                        }
                        <DataTableRow>
                            <IconButton
                            icon="add"
                            type="button"
                            onClick={() => {
                                data.push({label: '', data: NaN});
                                triggerRerender();
                            }}
                            
                            />
                        </DataTableRow>
                    </DataTableBody>
                </DataTableContent>
            </DataTable>

        </SimpleDialog>
    )

}

