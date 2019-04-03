import * as React from 'react';
import { Select } from '@rmwc/select';

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
    value: string,
    onChange: (arg: string) => any
}

class SectionsQuery extends Query<IData, {}> { }

export const SectionField: React.FunctionComponent<IHelperProps> = ({ value, onChange }) => {

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
                            <Select
                                label="Section"
                                outlined={true}
                                enhanced={true}
                                options={options}
                                value={value}
                                onChange={(evt: React.FormEvent<HTMLInputElement>) => { onChange(evt.currentTarget.value) }}
                            />
                        )
                    }
                }
            </SectionsQuery>
        </div>
    )
}