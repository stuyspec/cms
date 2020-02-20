import React from 'react';
import './UserHelpers.css'

import { Button } from '@rmwc/button';

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
    return (
        <Button 
            label="Upload Profile Picture" 
            icon="add" 
            type="file"
            accept=".jpg, .jpeg, .png"
        />
    )
}
