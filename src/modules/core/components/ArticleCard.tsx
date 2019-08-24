import * as React from 'react';
import './ArticleCard.css'

import { STUY_SPEC_URL } from '../../constants';

import { Card, CardActions, CardActionButtons, CardActionButton, CardPrimaryAction } from '@rmwc/card';
import { Typography } from '@rmwc/typography';

import { ContributorChip } from './ContributorChip';
import { IArticleData } from '../queryHelpers';

interface IProps {
    data: IArticleData
}

export const ArticleCard: React.SFC<IProps> = ({ data }) => (
    <Card className="ArticleCard">
        <CardPrimaryAction>
            <div style={{ padding: "10px" }}>
                <Typography use="headline6" tag="h2">
                    {data.title}
                </Typography>
                <Typography use="body1" tag="div" theme="textSecondaryOnBackground">
                    {data.preview || ""}
                </Typography>
                {
                    data.contributors
                        ? data.contributors.map((c) =>
                            <ContributorChip
                                slug={c.slug}
                                firstName={c.first_name || undefined}
                                lastName={c.last_name || undefined}
                                key={c.slug} deletable={false}
                            />
                        )
                        : <></>
                }
            </div>
        </CardPrimaryAction>
        <CardActions>
            <CardActionButtons>
                <CardActionButton
                    tag="a"
                    href={STUY_SPEC_URL + data.section.permalink + "/" + data.slug}
                >
                    Open
                            </CardActionButton>
                <CardActionButton
                    tag="a"
                    href={"/article/edit/" + data.slug}>Edit</CardActionButton>
            </CardActionButtons>
        </CardActions>
    </Card>
)
