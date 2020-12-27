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
            Contributor: false,
            Illustrator: false,
            Photographer: false
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
                    selected={selected.Contributor}
                    checkmark
                    onInteraction={() => select('Contributor')}
                    label="Contributor"
                    key="contributor"
                />
                <Chip
                    type='button'
                    icon="palette"
                    selected={selected.Illustrator}
                    checkmark
                    onInteraction={() => select('Illustrator')}
                    label="Illustrator"
                    key="illustrator"
                />
                <Chip
                    type='button'
                    icon="camera_alt"
                    selected={selected.Photographer}
                    checkmark
                    onInteraction={() => select("Photographer")}
                    label="Photographer"
                    key='photographer'
                />
            </ChipSet>
        );
    };