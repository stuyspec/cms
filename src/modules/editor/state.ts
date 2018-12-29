//tracks whether a user's attempt to publish an article succeeded
//null signifies no attempt, false a failed attempt, and true a successful one
export interface IEditorState {
    createArticleSucceeded: boolean | null,
    updateArticleSucceeded: boolean | null
}

export const initialEditorState: IEditorState = {
    createArticleSucceeded: null,
    updateArticleSucceeded: null
}