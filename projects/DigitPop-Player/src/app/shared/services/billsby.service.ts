import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/DigitPop-Player/src/environments/environment.staging';

@Injectable({ providedIn: 'root' })
export class BillsbyService {
  constructor(private httpClient: HttpClient) {}

  getCustomerDetails(id: any) {
    return this.httpClient.get(`${environment.billsbyUrl}/customers/` + id);
  }

  getSubscriptionDetails(sid: any) {
    return this.httpClient.get(
      `${environment.billsbyUrl}/subscriptions/` + sid, {
        headers: {'apikey':`${environment.billsbyKey}`}
     }
    );
  }

}
