import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {User} from '../models/user';
import {environment} from 'projects/DigitPop-CMS/src/environments/environment';
import {HTTP_CMS_AUTH} from '../../app.module';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({providedIn: 'root'})
export class AuthenticationService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(@Inject(HTTP_CMS_AUTH) private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentuser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  welcome() {
    return this.http.put<any>(`${environment.apiUrl}/api/users/` + this.currentUserValue._id + '/welcome', {id: this.currentUserValue._id});
  }

  projectWizardPopup() {
    // tslint:disable-next-line:max-line-length
    return this.http.put<any>(`${environment.apiUrl}/api/users/` + this.currentUserValue._id + '/projectWizardPopup', {id: this.currentUserValue._id});
  }

  login(email: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/local`, {email, password})
      .pipe(map((res) => {
        if (res.token) {
          res.user.token = res.token;
          localStorage.setItem('currentuser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        } else {
          alert(res.message);
        }
        return res.user;
      }), catchError((err, caught) => {
        console.log(err);
        return err;
      }));
  }

  storeUser(user: any) {
    localStorage.setItem('currentuser', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  updateUser(user: User) {
    return this.http.put<any>(`${environment.apiUrl}/api/users/` + user._id, {
      user,
    });
  }

  logout() {
    localStorage.removeItem('currentuser');
    this.currentUserSubject.next(null);
  }

  getUsage(user: User, cycle: any) {
    return this.http.get<any>(`${environment.apiUrl}/api/users/` + user._id + '/' + cycle + '/usage');
  }

  createUser(user: User) {
    const name = user.name;
    const email = user.email;
    const password = user.password;
    const role = user.role;

    return this.http
      .post<any>(`${environment.apiUrl}/api/users/`, {
        name, email, password, role,
      })
      .pipe(map((res) => {
        if (res.user && res.token) {
          res.user.token = res.token;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentuser', JSON.stringify(res.user));
          this.currentUserSubject.next(res.user);
        }

        return res;
      }));
  }
}
