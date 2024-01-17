import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth2Service } from './auth2.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuard implements CanActivate {
  constructor(private authService: Auth2Service, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.isAuthenticated() && this.authService.getUserRoles()[0] == 'ADMIN' || 'MASTER') {
      return true;
    }
    this.router.navigate(['login']);
    return false;
  }
}
