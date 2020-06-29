    import * as React from 'react';

    import {Chip} from '@rmwc/chip';
    import {ChipIcon} from '@rmwc/chip';
    import {ChipSet} from '@rmwc/chip';
    
    interface IProps {
        onInteraction: (s: string[]) => void,
        error?: string,
        label: string,
        required:boolean,
        role: String[]
    }

    export const RoleField: React.FunctionComponent<IProps> = ({
        role = [],
    }) => {

        function select(value: any){
            toggleSelected(value);
            arrayEdit(value);
        };
        function arrayEdit(this: any, roles: string){
            if(role.includes(roles)){
                const index = role.indexOf(roles);
                delete role[index]
            } else{
            role.push(roles);
            }
        }
        const [selected, setSelected] = React.useState({
            contributor: false,
            illustrator: false,
            photographer: false
        });
    
        const toggleSelected = (key: keyof typeof selected) =>
            setSelected({
                ...selected,
                [key]: !selected[key]
        });

        return (
            <ChipSet 
            filter
            style={{marginLeft: "1.5%", marginTop:"0.5%"}}
            >
                <Chip 
                    type='button'
                    icon="insert_comment"
                    selected={selected.contributor}
                    checkmark
                    onInteraction={() => select('contributor')}
                    label="Contributor"
                    key="contributor"
                    value='contributor'
                />
                <Chip
                    type='button'
                    icon="palette"
                    selected={selected.illustrator}
                    checkmark
                    onInteraction={() => select('illustrator')}
                    label="Illustrator"
                    key="illustrator"
                    value='illustrator'
                />
                <Chip
                    type='button'
                    icon="camera_alt"
                    selected={selected.photographer}
                    checkmark
                    onInteraction={() => select('photographer')}
                    label="Photographer"
                    key='photographer'
                    value='photographer'
                />
            </ChipSet>
        );
    };