import * as React from 'react';

import { Typography } from '@rmwc/typography';
import { ArticleCard, } from './ArticleCard';

const cardPadding = {
    marginBottom: "10px"
}

interface IResults {
    searchable: {
        id: string,
        title: string,
        preview?: string,
        slug: string,
        contributors?: Array<{ first_name?: string, last_name?: string, slug: string }>,
        section: { permalink: string }
    }
}

interface IProps {
    results: Array<IResults | undefined>
}

export const SearchResults: React.SFC<IProps> = ({ results }) => (
    <>
        <Typography use="headline3"><b>Search Results</b></Typography>
        {
            results.map(a => a ?
                <div style={cardPadding}>
                    <ArticleCard data={a.searchable} />
                </div>
                : undefined
            )
        }
    </>
)