import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthserviceService } from './authservice.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import * as fromApp from '../store/app.reducer'
import * as fromAutactions from '../auth/store/auth.action'
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})


export class AuthComponent implements OnInit {

  public errorMessage: string;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  authSub: Observable<any>
  constructor(private authservice: AuthserviceService, private route: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.store.select('auth').subscribe((authData) => {
      this.isLoading = authData.loading;
      this.errorMessage = authData.authError;
    })
  }

  onSubmit(signupForm: NgForm) {
    if (!signupForm.valid) {
      return null;
    }
    if (this.isLoggedIn) {
      this.store.dispatch(new fromAutactions.Loginstart({
        email: signupForm.value.email,
        password: signupForm.value.password
      }))
    } else {
      this.store.dispatch(new fromAutactions.SignUp({
        email: signupForm.value.email,
        password: signupForm.value.password
      }))
    }
    signupForm.reset();
  }


  onSwitch() {
    this.isLoggedIn = !this.isLoggedIn;
  }

}
