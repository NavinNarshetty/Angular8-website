import { Action } from '@ngrx/store'
import { User } from '../user.model';
import * as AuthActions from './auth.action'

export interface State {
  user: User;
  authError: string,
  loading: boolean
}

const initialState: State = {
  user: null,
  authError: null,
  loading: false
}

export function AuthReducer(state = initialState, actions: AuthActions.AuthActions) {
  switch (actions.type) {
    case AuthActions.LOGIN:
      const user = new User(actions.payload.email, actions.payload.id, actions.payload.token, actions.payload.expirationDate)
      return {
        ...state,
        user: user,
        loading: false
      }
      break;
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }
      break;
    case AuthActions.LOGIN_START:
    case AuthActions.SIGN_UP:
      return {
        ...state,
        authError: null,
        loading: true
      }
      break;
    case AuthActions.LOGIN_FAIL:
      return {
        ...state,
        authError: actions.payload,
        loading: false
      }
    default:
      return state;
      break;
  }

}