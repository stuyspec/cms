import React from 'react';

import { 
    DataTable, 
    DataTableContent, 
    DataTableBody, 
    DataTableHead, 
    DataTableHeadCell ,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';
import { IconButton } from '@rmwc/icon-button';
import { TextField } from '@rmwc/textfield';

interface IProps {
    // note: this prop's data is mutated directly!
    datasets: Array<{label: string, data: number[]}>,
    // note: this prop's data is mutated directly!
    labels: string[],
    // this must cause the component to be rendered as 
    // only datasets' and labels' contents are modified
    triggerRerender: () => any
}

export const ChartDataEditor: React.FC<IProps> = ({datasets, labels, triggerRerender}) => {
    return (
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
                                                required={true}
                                                placeholder={`Series ${index + 1}`}
                                                trailingIcon={{
                                                    icon: "delete",
                                                    type: "button",
                                                    title: "Delete series",
                                                    onClick: () => {
                                                        if (window.confirm("Are you sure you want to remove this series and its data?")) {
                                                            datasets.splice(index, 1);
                                                            triggerRerender();
                                                        }
                                                    }
                                                }}
                                                value={d.label}
                                                onChange={e => {
                                                    datasets[index].label = e.currentTarget.value; triggerRerender()
                                                }}
                                            />
                                        </DataTableHeadCell>
                                    )
                                )
                            }
                            <DataTableHeadCell>
                                <IconButton icon="add" title="New series" type="button" onClick={() => {
                                    datasets.push({
                                        label: "",
                                        data: []
                                    });
                                    triggerRerender();
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
                                            required={true}
                                            placeholder={`Label ${index + 1}`}
                                            value={l}
                                            trailingIcon={{
                                                icon: "delete",
                                                title: "Delete label",
                                                type: "button",
                                                onClick: () => {
                                                    if (window.confirm("Are you sure you want to delete this label and its data?")) {
                                                        labels.splice(index, 1);
                                                        datasets.forEach(d => {
                                                            d.data.splice(index, 1);
                                                        })
                                                        triggerRerender();
                                                    }
                                                }
                                            }}
                                            onChange={e => {
                                                labels[index] = e.currentTarget.value; triggerRerender()
                                            }}
                                        />
                                    </DataTableCell>
                                    {
                                        datasets.map((d, dIndex) => (
                                            <DataTableCell key={dIndex} >
                                                <TextField type="number" value={numToString(d.data[index])} onChange={e => {
                                                    datasets[dIndex].data[index] = e.currentTarget.value;
                                                    triggerRerender()
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
                                <IconButton icon="add" title="New label" type="button" onClick={() => {
                                    labels.push("");
                                    datasets.forEach((d) => {
                                        d.data.push(NaN)
                                    });
                                    triggerRerender();
                                }}
                                />
                            </DataTableCell>
                        </DataTableRow>
                    </DataTableBody>
                </DataTableContent>
            </DataTable>
    )
}

export function numToString(num: number | undefined | null): string {
    if (Object.is(num, NaN) || num === undefined || num === null) {
        return ""
    }
    else return num.toString(10)
}

export function stringToNum(str: string): number | undefined {
    const num = parseFloat(str);
    if (Object.is(NaN, num)) {
        return undefined;
    }
    else return num;
}