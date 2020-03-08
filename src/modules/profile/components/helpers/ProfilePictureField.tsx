import React from 'react';
import './UserHelpers.css'

import { Button } from '@rmwc/button';

import { snackbarQueue } from '../../../snackbarQueue';
import '@material/button/dist/mdc.button.css';

interface IProps {
    value: string,
    profile_picture: string,
    onPFPChange: (m: string, n: string) => void,
    error?: string
}

export const ProfilePictureField: React.SFC<IProps> = ({
    value,
    profile_picture,
    onPFPChange,
    error
}) => {
    const [dataURL, setDataURL] = React.useState(value ?? "");
    const [file, setFile] = React.useState("");
    const reader = new FileReader();
    reader.onloadend = (e) => { 
        setFile(reader.result as string); 
    }
    return (
        <div>
            <br/>
            <img style={{marginLeft: "1%"}} src={file} height={300}/>
            <br/>
            <input
                className={"mdc-button"}
                type="file"
                accept=".jpg, .jpeg, .png"
                onChange={e => {
                    onPFPChange(e.currentTarget.value, file);
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
                        }
                    }
                }}
            />
        </div>
    )
}
