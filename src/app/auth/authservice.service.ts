import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from "rxjs/operators";
import { throwError, Subject, BehaviorSubject } from 'rxjs';
import { User } from './user.model';
import { Router } from '@angular/router';

interface SignUp {
  email: string,
  password: string
}


interface AuthenticateData {
  idToken: string,
  email: string,
  refershToken: string,
  expiresIn: string,
  localId: string,
  registred?: boolean
}




@Injectable({
  providedIn: 'root'
})

export class AuthserviceService {
  public user = new BehaviorSubject<User>(null);

  private API_URL_SIGNUP = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key="
  private API_URL_LOGIN = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key="

  private API_KEY = "YOUR_API_KEY";
  private tokenExpirationtimer: any;
  constructor(private http: HttpClient, private router: Router) {

  }

  signup(signupData: SignUp) {
    return this.http.post<AuthenticateData>(this.API_URL_SIGNUP + this.API_KEY, {
      email: signupData.email,
      password: signupData.password,
      refershToken: true
    }).pipe(catchError(this.handleError), tap((resData) => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }))
  }

  login(loginData: SignUp) {
    return this.http.post<AuthenticateData>(this.API_URL_LOGIN + this.API_KEY, {
      email: loginData.email,
      password: loginData.password,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap((resData) => {
      this.handleAuthentication(resData.email, resData.localId, resData.idToken, +resData.expiresIn);
    }))
  }

  logout() {
    this.router.navigate(['/login']);
    this.user.next(null);
    localStorage.removeItem("userData");
    if (this.tokenExpirationtimer) {
      clearTimeout(this.tokenExpirationtimer);
    }

  }

  autoLogin() {
    const userData: {
      email: string,
      id: string,
      _token: string,
      _tokenExpirationDate: string

    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) {
      return;
    }
    let loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    if (loadedUser.token) {
      const expirationvalue = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.user.next(loadedUser);
      this.autoLogout(expirationvalue);
    }
  }


  autoLogout(expirationDuration) {
    this.tokenExpirationtimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  handleAuthentication(email: string, id: string, token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, id, token, expirationDate);
    console.log(user, "user");
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("userData", JSON.stringify(user));
  }

  handleError(errorRes: HttpErrorResponse) {
    let errorMessage = "An unknown error occured";
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(errorMessage);
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
    return throwError(errorMessage);
  }

}
