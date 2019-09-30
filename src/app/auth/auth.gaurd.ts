import { CanActivate, UrlTree, Router } from '@angular/router';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthserviceService } from './authservice.service';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGaurd implements CanActivate {
  constructor(private authservice: AuthserviceService, private router: Router) {

  }

  canActivate(routeSna: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Promise<boolean> | Observable<boolean | UrlTree> {
    return this.authservice.user.pipe(map((user) => {
      if (user) {
        return true;
      }
      return this.router.createUrlTree(['/login']);

    }))
  }
}