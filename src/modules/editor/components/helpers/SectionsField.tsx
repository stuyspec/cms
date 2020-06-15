import * as React from 'react';
import { Select } from '@rmwc/select';
import { ContributorChip } from '../../../core/components/ContributorChip';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const ALL_SECTIONS_QUERY = gql`
query allSections {
  allSections {
    name
    id
  }
}
`

interface ISection {
    name: string,
    id: string,
}

interface IData {
    allSections: Array<ISection | undefined>
}

interface IHelperProps {
    value: string[],
    onChange: (arg: string[]) => any
}

class SectionsQuery extends Query<IData, {}> { }

export const SectionsField: React.FunctionComponent<IHelperProps> = ({ value, onChange }) => {
    const [isInvalid, setIsInvalid] = React.useState(false)
    return (
        <div className="EditorField">
            <SectionsQuery query={ALL_SECTIONS_QUERY} >
                {
                    (results) => {
                        if (results.error) {
                            return "Could not load sections."
                        }
                        if (results.loading) {
                            return null;
                        }
                        const options: { [value: string]: string } = {};
                        results.data!.allSections.forEach(section => {
                            if (section) {
                                options[section.id] = section.name;
                            }
                        })
                        return (
                            <div>
                                <Select
                                    label="Section"
                                    outlined={true}
                                    enhanced={true}
                                    required={true}
                                    options={options}
                                    invalid={isInvalid}
                                    onBlur={() => { setIsInvalid(!value); } }
                                    onChange={(evt: React.FormEvent<HTMLInputElement>) => {
                                        if (value.includes(evt.currentTarget.value)) {
                                            onChange(value.concat([evt.currentTarget.value]));
                                        }
                                    }}
                                    
                                />
                                {value.map(s => <ContributorChip
                                    slug={s}
                                    key={s}
                                    deletable={true}
                                    onDelete={slug => onChange(value.filter(elem => elem !== slug))}
                                    />)}
                            </div>
                        )
                    }
                }
            </SectionsQuery>
        </div>
    )
}
