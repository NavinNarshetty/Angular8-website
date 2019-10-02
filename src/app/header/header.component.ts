import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthserviceService } from '../auth/authservice.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer'
import * as fromAuthaction from '../auth/store/auth.action'
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
    this.firstsubscription = this.store.select('auth').subscribe((userData) => {
      if (userData.user) {
        this.isAuthenticated = true;
      } else {
        this.isAuthenticated = false;
      }
    })
  }

  onLogout() {
    this.store.dispatch(new fromAuthaction.Logout());
    this.isAuthenticated = false;
  }

  ngOnDestroy() {
    this.firstsubscription.unsubscribe();
  }


}
