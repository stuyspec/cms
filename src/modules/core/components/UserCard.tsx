import * as React from 'react';
import './UserCard.css'

import { STUY_SPEC_URL } from '../../constants';

import { Card, CardActions, CardActionButtons, CardActionButton, CardPrimaryAction } from '@rmwc/card';
import { Typography } from '@rmwc/typography';

import { ContributorChip } from './ContributorChip';
import { IUserData } from '../queryHelpers';
import { ChipSet } from '@rmwc/chip';

interface IProps {
    data: IUserData,
    type?: string
}

export const UserCard: React.SFC<IProps> = ({ data, type }) => (
    <Card className="UserCard">
        <CardPrimaryAction>
            <div style={{ padding: "10px" }}>
                <Typography use="headline6" tag="h2">
                    {data.first_name} {data.last_name}
                </Typography>
            </div>
        </CardPrimaryAction>
    </Card>
)
