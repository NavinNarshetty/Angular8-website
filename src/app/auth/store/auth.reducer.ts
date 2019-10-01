import { Action } from '@ngrx/store'
import { User } from '../user.model';

export interface State {
  user: User;
}

const initialState: State = {
  user: null,
}

export function AuthReducer(state = initialState, actions: Action) {
  return state;
}