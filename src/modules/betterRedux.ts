export interface IGenericAction<State> {
    readonly type: string,
    handler: (state: State) => State,
}

export interface IAction<PayloadType, State> extends IGenericAction<State> {
    payload: PayloadType,
}

export class ActionCreator<PayloadType, State> {
    private readonly type: string;
    private handler: (state: State, action: PayloadType) => State;
    
    constructor(name: string, handler: (state: State, payload: PayloadType) => State) {
        this.type = name;
        this.handler = handler;
    }


    public call(payload: PayloadType): IAction<PayloadType, State> {
        return {
            type: this.type,
            handler: state => this.handler(state, payload),
            payload,
        };
    }
}
