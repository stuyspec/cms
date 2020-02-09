import { ActionCreator } from '../betterRedux';
import { IState } from '../state';

export const setCreateUserSucceeded = new ActionCreator<boolean | null, IState>(
    "editor/SET_CREATE_USER_SUCCEEDED",
    (state, payload) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                createUserSucceeded: payload
            }
        }
    }
)

export const setUpdateUserSucceeded = new ActionCreator<boolean | null, IState>(
    "editor/SET_UPDATE_ARTICLE_SUCCEEDED",
    (state, payload) => {
        return {
            ...state,
            editor: {
                ...state.editor,
                updateUserSucceeded: payload
            }
        }
    }
)
