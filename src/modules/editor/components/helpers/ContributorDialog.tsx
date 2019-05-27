import * as React from 'react';

import { Dialog, DialogTitle, DialogContent, DialogActions, DialogButton } from '@rmwc/dialog';
import { TextField, TextFieldIcon } from '@rmwc/textfield';
import { CircularProgress } from '@rmwc/circular-progress';
import {
    DataTable,
    DataTableContent,
    DataTableHead,
    DataTableBody,
    DataTableHeadCell,
    DataTableRow,
    DataTableCell
} from '@rmwc/data-table';


import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const CONTRIBUTORS_QUERY = gql`
{
    allUsersWithRoles {
        first_name
        last_name
        slug
        email
    }
}`

interface IUserData {
    first_name?: string,
    last_name?: string,
    slug: string,
    email: string
}

interface IData {
    allUsersWithRoles: IUserData[]
}

class ContributorsQuery extends Query<IData, {}> { }

const dialogStyle = { maxHeight: "75vh" };

interface IProps {
    open: boolean,
    onClose: (email: string | null) => any,
}

const initialState = {
    query: "",
    selected: null as string | null
}

export class ContributorDialog extends React.Component<IProps, typeof initialState> {
    constructor(props: IProps) {
        super(props);
        this.state = initialState;
    }

    public render() {
        return (
            <Dialog open={this.props.open} onStateChange={(state) => {
                if(state === "closing") {
                    this.props.onClose(this.state.selected)
                }
            }}>
                <DialogTitle>Select a Contributor</DialogTitle>
                <DialogContent>
                    <TextField
                        value={this.state.query}
                        onChange={this.onQueryChange}
                        fullwidth={true}
                        label="Search by name or email"
                        trailingIcon={{icon: "search"}}
                        autoComplete="none"
                    />
                    <ContributorsQuery query={CONTRIBUTORS_QUERY}>
                        {
                            ({ loading, data }) => {
                                if (loading) {
                                    return <CircularProgress />;
                                }
                                if (data) {
                                    return (
                                        <DataTable style={dialogStyle}>
                                            <DataTableContent>
                                                <DataTableHead>
                                                    <DataTableRow>
                                                        <DataTableHeadCell>Name</DataTableHeadCell>
                                                        <DataTableHeadCell alignEnd={true}>Email</DataTableHeadCell>
                                                    </DataTableRow>
                                                </DataTableHead>
                                                <DataTableBody>
                                                    {data.allUsersWithRoles.filter(this.filterMethod).map(u =>
                                                        <ContributorCell
                                                            user={u}
                                                            key={u.slug}
                                                            selected={this.state.selected === u.slug}
                                                            onSelect={this.onSelect}
                                                        />
                                                    )}
                                                </DataTableBody>
                                            </DataTableContent>
                                        </DataTable>
                                    )
                                }
                                return "Error loading data.";
                            }
                        }
                    </ContributorsQuery>
                </DialogContent>
                <DialogActions>
                    <DialogButton type="button" action="close">Close</DialogButton>
                    <DialogButton type="button" action="accept" disabled={this.state.selected === null}>Select</DialogButton>
                </DialogActions>
            </Dialog>
        )
    }

    private onQueryChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            query: e.currentTarget.value
        })
    }

    private filterMethod = (data: IUserData) => {
        return ((data.first_name || "") + " " + (data.last_name || "")).toUpperCase().includes(this.state.query.toUpperCase()) ||
            data.email.includes(this.state.query);
    }

    private onSelect = (slug: string) => {
        this.setState({
            selected: slug === this.state.selected ? null : slug
        })
    }
}

interface IContributorProps {
    user: IUserData,
    selected: boolean,
    onSelect: (email: string) => any,
}

const selectedStyle = {
    backgroundColor: "darkgray"
}

const ContributorCell: React.SFC<IContributorProps> = (data) => (
    <DataTableRow style={data.selected ? selectedStyle : undefined} onClick={e => data.onSelect(data.user.slug)}>
        <DataTableCell>{(data.user.first_name || "") + " " + (data.user.last_name || "")}</DataTableCell>
        <DataTableCell alignEnd={true}>{data.user.email}</DataTableCell>
    </DataTableRow>
)