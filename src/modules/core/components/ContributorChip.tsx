import * as React from 'react';
import '@material/chips/dist/mdc.chips.css';
import { Chip } from '@rmwc/chip';
import { CircularProgress } from '@rmwc/circular-progress';
import gql from 'graphql-tag';

import { client } from '../../apolloClient';


//The first and last name of the contributor can optionally be specified.
//Do this whenever possible.
//Supplying information allows the component to avoid unnecessary unbatched queries
interface IUserInfo { slug: string, firstName?: string, lastName?: string };

//This prop specifies whether the chip can be removed from a list
//Specifying true for deletable will render a delete button
//If deletable is true, a callback must be specified for the action performed on delete
type DeleteProps = { deletable: false } | { deletable: true, onDelete: (slug: string) => any };

type Props = IUserInfo & DeleteProps;

const USER_QUERY = gql`
    query ContributorChipQuery($slug: String!) {
        userBySlug(slug: $slug) {
            first_name
            last_name
        }
    }
`

interface IData {
    userBySlug?: { first_name: string, last_name: string }
}

interface IVariables {
    slug: string
}

export const ContributorChip: React.SFC<Props> = (props) => {
    const [name, setName] = React.useState(
        props.firstName === undefined
            || props.lastName === undefined
            ? undefined : props.firstName + " " + props.lastName
    );

    if (name === undefined) {
        client.query<IData, IVariables>({ query: USER_QUERY, variables: props })
            .then(
                (result) => {
                    if (result.errors || !result.data.userBySlug) {
                        setName("NETWORK ERROR")
                    }
                    else {
                        setName((result.data.userBySlug.first_name || "") + " " + (result.data.userBySlug.last_name || ""))
                    }
                }
            )
    }

    if (name === undefined) {
        return <Chip icon={<CircularProgress />} />
    }

    return (
        <Chip
            icon="face"
            label={name}
            trailingIcon={props.deletable ? "close" : undefined}
            onTrailingIconInteraction={props.deletable ? (e) => { props.onDelete(props.slug) } : undefined}
        />
    );

}