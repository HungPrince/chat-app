import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { API_URL } from './../../constants/constant';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {

  constructor(public http: Http) {
    console.log('Hello UserProvider Provider');
  }

  public login(params): Observable<any> {
    let url = API_URL + 'login';
    return this.http.post(url, params).map(res => res.json());
  }

  public signup(params): Observable<any> {
    let url = API_URL + 'registerUser';
    return this.http.post(url, params).map(res => res.json());
  }

  public uploadImage(params): Observable<any> {
    let url = API_URL + 'upload';
    return this.http.post(url, params).map(res => res.json);
  }

  public getListUser(): Observable<any> {
    let url = API_URL + 'getListUser';
    return this.http.get(url).map(res => res.json());
  }

  public getUserActive(params): Observable<any> {
    let url = API_URL + 'getUserActive';
    return this.http.post(url, params).map(res => res.json());
  }

  public getMessages(params): Observable<any> {
    let url = API_URL + 'getMessages';
    return this.http.post(url, params).map(res => res.json());
  }

}
