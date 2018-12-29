import { IAccountsState, initialAccountsState } from './accounts/state';
import { IEditorState, initialEditorState } from './editor/state';

export interface IState {
    readonly accounts: IAccountsState,
    readonly editor: IEditorState
}

export const initialState: IState = {
    accounts: initialAccountsState,
    editor: initialEditorState
}