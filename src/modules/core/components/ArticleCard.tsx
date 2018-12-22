import * as React from 'react';
import './ArticleCard.css'

import { STUY_SPEC_URL } from '../../constants';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { Card, CardActions, CardActionButtons, CardAction, CardPrimaryAction } from '@rmwc/card';
import { Typography } from '@rmwc/typography';

import { ContributorChip } from './ContributorChip';

//import { Link } from 'react-router-dom';

interface IProps {
    id: string
}

const ARTICLE_BY_ID = gql`
    query ArticleByID($id: ID!) {
        articleByID(id: $id) {
            title
            preview
            slug
            contributors {
                slug
            }
            section {
                permalink
            }
        }
    }
`

interface IData {
    articleByID?: {
        title: string,
        preview?: string,
        slug: string,
        contributors?: [{
            slug: string,
        }],
        section: {
            permalink: string
        }
    }
}

interface IVariables {
    id: string,
}

class ArticleQuery extends Query<IData, IVariables> { }

export const ArticleCard: React.SFC<IProps> = (props) => (
    <ArticleQuery query={ARTICLE_BY_ID} variables={props}>
        {({ data }) => {
            console.dir(data);
            if (!(data && data.articleByID)) {
                //TODO: write proper fallback
                return null
            }
            return (
                <Card className="ArticleCard">
                    <CardPrimaryAction>
                        <div style={{ padding: "10px" }}>
                            <Typography use="headline6" tag="h2">
                                {data.articleByID.title}
                            </Typography>
                            <Typography use="body1" tag="div" theme="text-secondary-on-background">
                                {data.articleByID.preview || ""}
                            </Typography>
                            {
                                data.articleByID.contributors
                                    ? data.articleByID.contributors.map((c) => <ContributorChip slug={c.slug} key={c.slug} deletable={false} />)
                                    : <></>
                            }
                        </div>
                    </CardPrimaryAction>
                    <CardActions>
                        <CardActionButtons>
                            <CardAction
                                tag="a"
                                href={STUY_SPEC_URL + data.articleByID.section.permalink + "/" + data.articleByID.slug}
                            >
                                Open
                            </CardAction>
                            <CardAction
                            tag="a"
                            href={"/article/edit/" + data.articleByID.slug}>Edit</CardAction>
                        </CardActionButtons>
                    </CardActions>
                </Card>
            )
        }
        }
    </ArticleQuery>
);