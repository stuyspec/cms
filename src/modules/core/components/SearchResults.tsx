import * as React from 'react';

import { Typography } from '@rmwc/typography';
import { ArticleCard } from './ArticleCard';

const cardPadding = {
    marginBottom: "10px"
}

interface IProps {
    results: Array<{ id: string } | undefined>
}

export const SearchResults: React.SFC<IProps> = ({results}) => (
    <>
        <Typography use="headline3"><b>Search Results</b></Typography>
        {
            results.map(a => a ?
                <div style={cardPadding}>
                    <ArticleCard id={a.id} />
                </div>
                : undefined
            )
        }
    </>
)