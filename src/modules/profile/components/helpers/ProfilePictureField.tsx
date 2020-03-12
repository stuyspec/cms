import React from 'react';

import { snackbarQueue } from '../../../snackbarQueue';

import '@material/button/dist/mdc.button.css';

interface IProps {
    onPFPChange: (profile_picture: string) => void,
    onPFPURLChange: (profile_url: string) => void,
    error?: string
}

export const ProfilePictureField: React.SFC<IProps> = ({
    onPFPChange,
    onPFPURLChange,
    error
}) => {
    const reader = new FileReader();
    reader.onloadend = (e) => { 
        onPFPChange(reader.result as string); 
    }
    return (
        <input
            className={"mdc-button"}
            type="file"
            accept=".jpg, .jpeg, .png"
            onChange={e => {
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
                    else {
                        reader.readAsDataURL(e.target.files![0]); 
                        onPFPURLChange(e.currentTarget.value);
                    }
                }
            }}
        />
    )
}
