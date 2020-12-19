import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../models/User';

@Injectable({
    providedIn: 'root',
})
export class ApiService {

    headers = new HttpHeaders();
    currentUser: User = null;
    rememberUserName = '';
    token = '';
    expiresAfter = '';

    constructor(private http: HttpClient) {
        this.headers.set('Content-Type', 'application/json');
    }

    VerifyId(img: string, type: number) {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ` + this.token,
            })
        };
        return this.http.post(`${environment.URL_API}/verification`, {document: img, type}, httpOptions);
    }

    login(email: string, password: string) {
        return this.http.post(`${environment.URL_API}/login`, {
            email,
            password
        }, {headers: this.headers});
    }

    register(user: User) {
        return this.http.post(`${environment.URL_API}/register`, {
            name: user.name,
            email: user.email,
            password: user.password,
            password_confirmation: user.password
        }, {headers: this.headers});
    }

    profile() {
        const httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                Authorization: `Bearer ` + this.token,
            })
        };
        return this.http.post(`${environment.URL_API}/profile`, {}, httpOptions);
    }
}
