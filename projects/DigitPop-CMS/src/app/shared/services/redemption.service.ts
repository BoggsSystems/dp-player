import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Redemption} from '../models/redemption';
import {environment} from 'projects/DigitPop-CMS/src/environments/environment';
import {HTTP_XCHANE_AUTH} from '../../app.module';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})

export class RedemptionService {
  constructor(@Inject(HTTP_XCHANE_AUTH) private http: HttpClient) {
  }

  requestRedemption(redemption: Redemption) {
    return this.http.post(`${environment.apiUrl}/api/redemption/`, redemption, httpOptions);
  }
}
