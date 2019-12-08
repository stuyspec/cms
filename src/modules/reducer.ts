//import accountsReducer from "./accounts/reducer";
import { IState, initialState } from './state';
import { IGenericAction } from "./betterRedux";

export function reducer(state: IState | undefined, action: any): IState {
    if((action as IGenericAction<IState> | undefined)?.handler) {
        return action.handler(state)
    }
    return state || initialState;
}