import { Action } from '@ngrx/store'
import { User } from '../user.model';
import * as AuthActions from './auth.action'

export interface State {
  user: User;
}

const initialState: State = {
  user: null,
}

export function AuthReducer(state = initialState, actions: AuthActions.AuthActions) {
  switch (actions.type) {
    case AuthActions.LOGIN:
      const user = new User(actions.payload.email, actions.payload.id, actions.payload.token, actions.payload.expirationDate)
      return {
        ...state,
        user: user
      }
      break;
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      }

    default:
      return state;
      break;
  }

}