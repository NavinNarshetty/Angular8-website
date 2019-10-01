import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthserviceService } from '../auth/authservice.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isAuthenticated: boolean = false;
  private firstsubscription: Subscription;
  constructor(private authService: AuthserviceService, private store: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.firstsubscription = this.store.select('auth').pipe(map((userData) => {
      return userData.user
    })).subscribe((userData) => {
      if (userData) {
        // console.log(userData, "userdata")
        return this.isAuthenticated = true;
      }
      return false;
    })
  }

  onLogout() {
    this.authService.logout();
    this.isAuthenticated = false;
  }

  ngOnDestroy() {
    this.firstsubscription.unsubscribe();
  }


}
