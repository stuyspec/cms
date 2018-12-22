import { IAccountsState, initialAccountsState } from './accounts/state';

export interface IState {
    readonly accounts: IAccountsState,
}

export const initialState: IState = {
    accounts: initialAccountsState
}