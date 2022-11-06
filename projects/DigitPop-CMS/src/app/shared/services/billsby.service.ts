import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService } from './auth-service.service';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';
import { HTTP_BILLS } from '../../app.module'
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BillsbyService {
  constructor(private httpClient: HttpClient,
    private authService: AuthenticationService
  ) {

    var x = "test";
  }
  // constructor(private httpClient: HttpClient) {}

  getCustomerDetails(id: any) {
    console.log(`${environment.billsbyKey}`);
    const headers= new HttpHeaders()
        .set('apikey', `${environment.billsbyKey}`);
    return this.httpClient.get(`${environment.billsbyUrl}/customers/` + id, { 'headers': headers });
  }

  getSubscriptionDetails() {
    return this.httpClient.get(
      `${environment.billsbyUrl}/subscriptions/` + '4EDK89XEW7'
        // this.authService.currentUserValue._id
    );
  }

  cancelSubscription() {
    return this.httpClient.delete(`${environment.billsbyUrl}/subscriptions/` + this.authService.currentUserValue.sid, {params: {customerUniqueId: this.authService.currentUserValue.cid }});
  }

  pauseSubscription() {
    return this.httpClient.put(`${environment.billsbyUrl}/subscriptions/` + this.authService.currentUserValue.sid + '\?cid' + this.authService.currentUserValue.cid, {params: {pauseSubscription: true, pauseSubscriptionCycleCount : 1}});
  }
}
