import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { jwtDecode } from "jwt-decode";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { JwtPayload } from './jwt-payload.model';
import { TokenInfo } from './token-info.model';

@Injectable({ providedIn: 'root' })
export class Auth2Service {
    private authenticationSubject: BehaviorSubject<JwtPayload>;
    public authentication: Observable<JwtPayload>;

    constructor(private http: HttpClient, private snackbar: MatSnackBar) {
        this.authenticationSubject = new BehaviorSubject<JwtPayload>(this.decodeToken());
        this.authentication = this.authenticationSubject.asObservable();
    }

    public getToken(): string {
        const token = sessionStorage.getItem('token') || '';

        return token;
    }

    public getUsername(): string {
        const decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.login;
    }

    public getUserId(): number {
        const decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.id;
    }

    public getUserFullname(): string {
        const decodedToken: JwtPayload = this.decodeToken();

        return decodedToken.login;
    }

    public getUserRoles(): string[] {
        const decodedToken: JwtPayload = this.decodeToken();

        if (decodedToken)
            return decodedToken.role;
        else
            return [];
    }

    public isUserInRole(role: string): boolean {
        const roles = this.getUserRoles();

        if (roles) {
            return roles.filter(r => r === role).length > 0;
        } else
            return false;
    }

    public getTokenExpirationDate(token: string): Date {
        const decoded = this.decodeToken();

        // if (decoded.exp === undefined) return null;

        const date = new Date(0);
        date.setUTCSeconds(decoded.exp);
        return date;
    }

    public isTokenExpired(): boolean {
        const token = this.getToken();
        if (!token) return true;

        const date = this.getTokenExpirationDate(token);
        if (date === undefined) return false;
        return !(date.valueOf() > new Date().valueOf());
    }

    public changePassword(): boolean {
        const decoded = this.decodeToken();

        return decoded.must_change_password;
    }

    logout() {
        sessionStorage.removeItem('token');
        this.authenticationSubject.next(new JwtPayload());
    }

    public isAuthenticated(): boolean {
        const decodedToken = this.decodeToken();

        return decodedToken != null && !this.isTokenExpired();
    }

    private decodeToken(): any {
        const token = this.getToken();

        if (token) {
            const decodedToken = jwtDecode(token);
            return decodedToken;
        } else
            return null;
    }

    login(username: string, password: string): Observable<TokenInfo> {
        const body = { 'login': username, 'password': password };
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        };

        return this.http.post<any>(`${environment.oAuthTokenUrl}`, body, httpOptions).pipe(
            map((data: any) => {
                sessionStorage.setItem('token', data.token);
                this.authenticationSubject.next(data);
                return data;
            })
        );
    }

    registerUser(user: any): Observable<any> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });

        return this.http.post<any>(`${environment.oAuthRegisterUrl}`, user, { headers });
    }
}