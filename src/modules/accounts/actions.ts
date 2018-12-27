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
    if (payload) {
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

const setErrors= new ActionCreator<string[], IState>(
  "accounts/SET_ERRORS",
  (state, errors) => (
    {
      ...state,
      accounts: {
        ...state.accounts,
        errors
      }
    }
  )
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

export const signIn = async (dispatch: Dispatch, params: ISignInParams) => {
  //dispatch(signInPending.call(params));
  dispatch(setErrors.call([]))
  try {
    const response = await fetch(`${STUY_SPEC_API_URL}/auth/sign_in`, {
      method: "POST",
      headers: STUY_SPEC_API_HEADERS,
      body: JSON.stringify({
        email: params.email,
        password: params.password
      }),
    });
    
    const session = headersToAccountsSession(response.headers);
    dispatch(setSession.call(session));
    const results = await response.json();
    if (results.errors) {
      dispatch(setErrors.call(results.errors))
    }
  }

  catch (e) {
    console.error(e)
    dispatch(setErrors.call(["Failed to connect to server."]))
    dispatch(setSession.call(null));
  }
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