import React from 'react';
import './UserHelpers.css'

import { Button } from '@rmwc/button';

import { snackbarQueue } from '../../../snackbarQueue';

interface IProps {
    value: string,
    onPFPChange: (m: string) => void,
    error?: string
}

export const ProfilePictureField: React.SFC<IProps> = ({
    value,
    onPFPChange,
    error
}) => {
    const [dataURL, setDataURL] = React.useState(value ?? "");
    const reader = new FileReader();
    reader.onloadend = (e) => { setDataURL(reader.result as string) }
    return (
        <Button className="mdc-button"  
                label="Upload Profile Picture" 
                icon="add"
        > 
            <input
                type="file"
                accept=".jpg, .jpeg, .png"
                value={value}
                onChange={e => {
                    onPFPChange(e.currentTarget.value);
                    if (e.target.files && e.target.files.length > 0) {
                        if (e.target.files![0].size >= 2500 * 1000) {
                            snackbarQueue.notify({
                                icon: 'error',
                                body: 'Images larger than 2.5MB are not supported.',
                                actions: [
                                    { title: 'Dismiss' }
                                ]
                            })
                        }
                        else reader.readAsDataURL(e.target.files![0])
                    }
                    else setDataURL("");
                }}
            />
        </Button>
    )
}
