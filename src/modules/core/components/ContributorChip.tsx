import * as React from 'react';
import { Chip } from '@rmwc/chip';
import { CircularProgress } from '@rmwc/circular-progress';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

type Props = { slug: string } & ({ deletable: false } | { deletable: true, onDelete: (id: string) => any });

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

class UserByEmailQuery extends Query<IData, IVariables> { };

export const ContributorChip: React.SFC<Props> = (props) => (
    <UserByEmailQuery query={USER_QUERY} variables={{ slug: props.slug }}>
        {({ loading, data }) => {
            console.dir(data)
            if(loading) {
                return <Chip leadingIcon={<CircularProgress />} />
            }
            return (
                <Chip
                    leadingIcon="face"
                    text={data && data.userBySlug ? data.userBySlug.first_name + " " + data.userBySlug.last_name : "INVALID USER"}
                    trailingIcon={props.deletable ? "close" : undefined}
                    onTrailingIconInteraction={props.deletable ? (e) => { props.onDelete(props.slug) } : undefined}
                />
            );
        }}
    </UserByEmailQuery>
)