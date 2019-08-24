import gql from 'graphql-tag';

export interface ISearchData {
    searchArticles: Array<({
        searchable: IArticleData
    } | undefined)>
}

export interface ISearchVariables {
    query: string
}

export const SEARCH_QUERY = gql`
query SearchQuery($query: String!) {
    searchArticles(query: $query) {
        searchable {
            id
            title
            preview
            slug
            volume
            issue
            created_at
            contributors {
                slug
                first_name
                last_name
            }
            section {
                permalink
                id
                name
            }
        }
    }
}`

export interface IArticleData {
    id: string,
    title: string,
    preview?: string,
    slug: string,
    volume: number,
    issue: number,
    created_at?: string
    contributors?: Array<{ first_name?: string, last_name?: string, slug: string }>,
    section: { permalink: string, id: string, name: string }
}

export interface ISearchResults {
    searchable: IArticleData
}