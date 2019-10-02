import { Component, OnInit } from '@angular/core';
import { AuthserviceService } from './auth/authservice.service';
import * as fromApp from '../app/store/app.reducer'
import { Store } from '@ngrx/store';
import * as fromAuthaction from '../app/auth/store/auth.action'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular8-website';
  constructor(private authservice: AuthserviceService, private store: Store<fromApp.AppState>) {

  }
  ngOnInit() {
    this.store.dispatch(new fromAuthaction.AutoLogin());
    // this.authservice.autoLogin();
  }
}
