import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP_XCHANE_AUTH} from '../../app.module';
import {environment} from '../../../environments/environment';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})

export class RewardService {
  constructor(@Inject(HTTP_XCHANE_AUTH) private http: HttpClient) {
  }

  getRewards() {
    return this.http.get(`${environment.apiUrl}/api/rewards/`);
  }
}
