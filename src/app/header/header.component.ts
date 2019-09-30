import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthserviceService } from '../auth/authservice.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public isAuthenticated: boolean = false;
  private firstsubscription: Subscription;
  constructor(private authService: AuthserviceService) { }

  ngOnInit() {
    this.firstsubscription = this.authService.user.subscribe((userData) => {
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
