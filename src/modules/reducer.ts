//import accountsReducer from "./accounts/reducer";
import { IState } from './state';
import { IGenericAction } from "./betterRedux";

export function reducer(state: IState, action: any): IState {
    if((action as IGenericAction<IState>).handler) {
        return action.handler(state)
    }
    return state;
}