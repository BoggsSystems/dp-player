import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user';
import { XchaneUser } from '../models/xchane.user';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' } ),
};

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(
      JSON.parse(localStorage.getItem('currentUser'))
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  welcome() {
    return this.http.put<any>(
      `${environment.apiUrl}/api/users/` +
        this.currentUserValue._id +
        '/welcome',
      { id: this.currentUserValue._id }
    );
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/local`, { email, password })
      .pipe(
        map((res) => {
          // login successful if there's a jwt token in the response
          console.log('LOGIN RESULT : ' + JSON.stringify(res));
          if (res.token) {
            console.log('Successful login');
            res.user.token = res.token;
            console.log('Set token of user : ' + res.user.token);
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            console.log('Set current user in local storage');
            this.currentUserSubject.next(res.user);
          }
          return res.user;
        })
      );
  }

  storeUser(user: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateUser(user: User) {
    return this.http.put<any>(`${environment.apiUrl}/api/users/` + user._id, {
      user,
    });
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getUsage(user: User, cycle: any) {
    return this.http.get<any>(
      `${environment.apiUrl}/api/users/` + user._id + '/' + cycle + '/usage'
    );
  }

  createUser(user: User) {

    var name = user.name;
    var password = user.password;
    var sid = user.sid;
    var cid = user.cid;

    return this.http
      .post<any>(`${environment.apiUrl}/api/users/`, {name, password, sid, cid})
      .pipe(
        map((res) => {
          // login successful if there's a jwt token in the response
          if (res.user && res.token) {
            console.log('Successful login');
            res.user.token = res.token;
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('currentUser', JSON.stringify(res.user));
            this.currentUserSubject.next(res.user);
          }

          return res.user;
        })
      );

    // return this.http.post<any>(`${environment.apiUrl}/api/users/`, {
    //   packet,
    // });
  }


}
