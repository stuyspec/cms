export interface IAccountsState extends Object {
    //readonly status: IAccountsStatus;
    session: IAccountsSession | null;
    error: string | null;
}

/*export interface IAccountsStatus {
    readonly errors: string[];
    readonly message: string | null;
}*/

export interface IAccountsSession {
    "access-token": string;
    expiry: string;
    client: string;
    uid: string;
}

export const initialAccountsState: IAccountsState = {
    session: getLocalSession(),
    error: null
}

function getLocalSession(): IAccountsSession | null {
    const session = window.localStorage.getItem("session");
    if (session) {
        return JSON.parse(session);
    }
    return null;
}