import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';
import * as fromApp from "../../app/store/app.reducer";
import * as fromAuthaction from '../auth/store/auth.action'

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
  private tokenExpirationtimer: any;
  constructor(private store: Store<fromApp.AppState>) {

  }




  setexpirationDuration(expirationDuration) {
    this.tokenExpirationtimer = setTimeout(() => {
      // this.logout();
      this.store.dispatch(new fromAuthaction.Logout());
    }, expirationDuration);
  }

  clearexpirationDuration() {
    if (this.tokenExpirationtimer) {
      clearTimeout(this.tokenExpirationtimer);
    }
    this.tokenExpirationtimer = null
  }








}
