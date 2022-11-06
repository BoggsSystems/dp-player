import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Redemption } from '../models/redemption';
import { HTTP_XCHANE_AUTH } from '../../app.module';

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class RedemptionService {

    constructor(@Inject(HTTP_XCHANE_AUTH) private http: HttpClient) { }

    requestRedemption(redemption: Redemption) {
        console.log('In requestRedemption');
        return this.http.post('/api/redemption/', redemption, httpOptions);
    }

}

