import { ActionCreator } from '../betterRedux';
import { IState } from '../state';

export const setCreateArticleSucceeded = new ActionCreator<boolean | null, IState>(
    "editor/SET_CREATE_ARTICLE_SUCCEEDED",
    (state, payload) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                createArticleSucceeded: payload
            }
        }
    }
)

export const setUpdateArticleSucceeded = new ActionCreator<boolean | null, IState>(
    "editor/SET_UPDATE_ARTICLE_SUCCEEDED",
    (state, payload) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                updateArticleSucceeded: payload
            }
        }
    }
)