import { IAccountsSession } from './state';
import { IState } from '../state';
import { Dispatch } from 'redux';
import { ActionCreator } from '../betterRedux';
import { STUY_SPEC_API_URL, STUY_SPEC_API_HEADERS } from '../constants';

interface ISignInParams {
  email: string,
  password: string,
}

export const setSession = new ActionCreator<IAccountsSession | null, IState>(
  "accounts/SET_SESSION",
  (state, payload): IState => {
    if(payload) {
      try {
        window.localStorage.setItem("session", JSON.stringify(payload))
      }
      catch { console.log("Could not save session locally."); }
    }
    else {
      window.localStorage.removeItem("session");
    }
    return {
      ...state,
      accounts: {
        ...state.accounts,
        session: payload ? headersObjectToAccountsSession(payload) : null
      }
    }
  }
)

/*export const signInPending = new ActionCreator<ISignInParams, IState>(
  "accounts/SIGN_IN_PENDING",
  (state, payload): IState => {
    return {
      ...state,
      accounts: {
        ...state.accounts,
        error: null
      }
    }
  }
)

export const signInFulfilled = new ActionCreator<IAccountsSession, IState>(
  "accounts/SIGN_IN_FULFILLED",
  (state, payload): IState => {
    return {
      ...state,
      accounts: {
        ...state.accounts,
        session: payload
      }
    }
  }
)

export const signInRejected = new ActionCreator<null, IState>(
  "accounts/SIGN_IN_REJECTED",
  (state, payload): IState => {
    return {
      ...state,
      accounts: {
        ...state.accounts,
        session: null
      }
    }
  }
)*/

export const validateTokenPending = new ActionCreator<void, IState>(
  "accounts/VALIDATE_TOKEN_PENDING",
  (state, payload): IState => {
    return {
      ...state,
    }
  }
)

export const signIn = (dispatch: Dispatch, params: ISignInParams) => {
  //dispatch(signInPending.call(params));
  console.log("about to fetch.");
  fetch(`${STUY_SPEC_API_URL}/auth/sign_in`, {
    method: "POST",
    headers: STUY_SPEC_API_HEADERS,
    body: JSON.stringify({
      email: params.email,
      password: params.password
    }),
  })
    .then(
      response => {
        console.log("fetch completed!");
        const session = headersToAccountsSession(response.headers);
        dispatch(setSession.call(session));
        /*if (session) {
          dispatch(signInFulfilled.call(session));
        }
        else {
          dispatch(signInRejected.call(null))
        }*/
      }
    )
    .catch(
      () => {
        //dispatch(signInRejected.call(null));
        dispatch(setSession.call(null));
      }
    )
}

function headersToAccountsSession(headers: Headers): IAccountsSession | null {
  if (headers.has("access-token") && headers.has("expiry") && headers.has("client") && headers.has("uid")) {
    return {
      "access-token": headers.get("access-token") as string,
      expiry: headers.get("expiry") as string,
      client: headers.get("client") as string,
      uid: headers.get("uid") as string
    }
  }
  return null;
}

function headersObjectToAccountsSession(headers: object): IAccountsSession | null {
  if (headers["access-token"] &&
    (headers as IAccountsSession).expiry &&
    (headers as IAccountsSession).client &&
    (headers as IAccountsSession).uid
  ) {
    return headers as IAccountsSession
  }
  return null;
}