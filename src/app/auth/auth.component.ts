import { Component, OnInit } from '@angular/core';
import { Form, NgForm } from '@angular/forms';
import { AuthserviceService } from './authservice.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

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
  constructor(private authservice: AuthserviceService, private route: Router) { }

  ngOnInit() {
  }

  onSubmit(signupForm: NgForm) {
    console.log(signupForm)
    if (!signupForm.valid) {
      return null;
    }
    if (this.isLoggedIn) {
      this.isLoading = true;
      this.authSub = this.authservice.login(signupForm.value);
    } else {

      this.isLoading = true;
      this.authSub = this.authservice.signup(signupForm.value);
    }

    this.authSub.subscribe((responseData) => {
      // console.log(responseData);
      this.isLoading = false;
      if (this.isLoggedIn) {
        this.route.navigate(["/welcome"])
      }
    }, (error) => {
      this.isLoading = false;
      this.errorMessage = error;
    })
    signupForm.reset();
  }


  onSwitch() {
    this.isLoggedIn = !this.isLoggedIn;
  }

}
