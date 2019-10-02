import { Action } from '@ngrx/store';

export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
export const LOGIN_START = "LOGIN_START";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const SIGN_UP = "SIGN_UP";
export const AUTO_LOGIN = "AUTO_LOGIN";

export class Login implements Action {
  readonly type = LOGIN
  constructor(public payload: {
    email: string,
    id: string,
    token: string,
    expirationDate: Date
  }) {

  }
}

export class Logout implements Action {
  readonly type = LOGOUT
}

export class Loginstart implements Action {
  readonly type = LOGIN_START

  constructor(public payload: {
    email: string,
    password: string
  }) {

  }
}

export class LoginFail implements Action {
  readonly type = LOGIN_FAIL
  constructor(public payload: string) {

  }
}

export class SignUp implements Action {
  readonly type = SIGN_UP
  constructor(public payload: {
    email: string,
    password: string
  }) {

  }
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN
}


export type AuthActions = Login | Logout | Loginstart | LoginFail | SignUp | AutoLogin;