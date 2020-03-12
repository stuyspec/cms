import { IAccountsState, initialAccountsState } from './accounts/state';
import { IEditorState, initialEditorState } from './editor/state';
import { IProfileState, initialProfileState } from './profile/state';


export interface IState {
    readonly accounts: IAccountsState,
    readonly editor: IEditorState,
    readonly profile: IProfileState
}

export const initialState: IState = {
    accounts: initialAccountsState,
    editor: initialEditorState,
    profile: initialProfileState
}
