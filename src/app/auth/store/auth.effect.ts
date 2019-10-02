import { Actions, Effect, ofType } from "@ngrx/effects";
import { Injectable } from '@angular/core';
import * as fromAuthaction from './auth.action'
import { switchMap, map, catchError, tap } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import { AuthserviceService } from '../authservice.service';

interface AuthenticateData {
  idToken: string,
  email: string,
  refershToken: string,
  expiresIn: string,
  localId: string,
  registred?: boolean
}


const handleAuthentication = (email: string, id: string, token: string, expiresIn: number) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, id, token, expirationDate);
  localStorage.setItem("userData", JSON.stringify(user));

  return new fromAuthaction.Login({
    email: email,
    id: id,
    token: token,
    expirationDate: expirationDate
  })
}
const handleError = (errorRes: HttpErrorResponse) => {
  let errorMessage = "An unknown error occured";
  if (!errorRes.error || !errorRes.error.error) {
    return of(new fromAuthaction.LoginFail(errorMessage));
  }
  switch (errorRes.error.error.message) {
    case "EMAIL_EXISTS":
      errorMessage = "The email address is already in use by another account.";
      break;
    case "OPERATION_NOT_ALLOWED":
      errorMessage = "Password sign-in is disabled for this project.";
      break;
    case "TOO_MANY_ATTEMPTS_TRY_LATER":
      errorMessage = "We have blocked all requests from this device due to unusual activity. Try again later."
    case "EMAIL_NOT_FOUND":
      errorMessage = "There is no user record corresponding to this identifier. The user may have been deleted."
      break;
    case "INVALID_PASSWORD":
      errorMessage = "The password is invalid or the user does not have a password."
      break;
    case "USER_DISABLED":
      errorMessage = "The user account has been disabled by an administrator.";
      break;
    default:
      errorMessage = "An unknown error occured";
      break;
  }
  return of(new fromAuthaction.LoginFail(errorMessage));
}
@Injectable()
export class AuthEffect {
  private API_URL_LOGIN = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="
  private API_URL_SIGNUP = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  private API_KEY = "YOUR_API_KEY";
  @Effect()
  authLogin = this.action$.pipe(
    ofType(fromAuthaction.LOGIN_START),
    switchMap((authData: fromAuthaction.Loginstart) => {
      return this.http.post<AuthenticateData>(this.API_URL_LOGIN + this.API_KEY, {
        email: authData.payload.email,
        password: authData.payload.password,
        returnSecureToken: true
      }).pipe(
        tap((resData) => {
          this.authservice.setexpirationDuration(+resData.expiresIn * 1000);
        }),
        map((resData) => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
        }),
        catchError((errors) => {

          return handleError(errors);
        })
      )
    })
  )
  @Effect()
  authSignup = this.action$.pipe(
    ofType(fromAuthaction.SIGN_UP),
    switchMap((signupData: fromAuthaction.SignUp) => {
      return this.http.post<AuthenticateData>(this.API_URL_SIGNUP + this.API_KEY, {
        email: signupData.payload.email,
        password: signupData.payload.password,
        refershToken: true
      }).pipe(
        tap((resData) => {
          this.authservice.setexpirationDuration(+resData.expiresIn * 1000);
        }),
        map((resData) => {
          return handleAuthentication(resData.email, resData.localId, resData.idToken, + resData.expiresIn);
        }), catchError((errors) => {
          return handleError(errors);
        }))
    })
  )
  @Effect({
    dispatch: false
  })
  authSuccess = this.action$.pipe(ofType(fromAuthaction.LOGIN), tap((authData: fromAuthaction.Login) => {

    this.router.navigate(['/welcome'])
  }))

  @Effect()
  autoogin = this.action$.pipe(ofType(fromAuthaction.AUTO_LOGIN), map(() => {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string

    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return {
        type: 'DUMMY'
      };
    }
    let loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      const expirationvalue = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      // this.user.next(loadedUser);
      this.authservice.setexpirationDuration(expirationvalue);
      return new fromAuthaction.Login(
        {
          email: loadedUser.email,
          id: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate)
        }
      )
    }
    return {
      type: 'DUMMY'
    }
  }))



  @Effect({
    dispatch: false
  })
  authLogout = this.action$.pipe(ofType(fromAuthaction.LOGOUT), tap(() => {
    this.router.navigate(['/login'])
    localStorage.removeItem("userData");
    this.authservice.clearexpirationDuration();
  }))
  constructor(private action$: Actions, private http: HttpClient, private router: Router, private store: Store<fromApp.AppState>, private authservice: AuthserviceService) {

  }
}