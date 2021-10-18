import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { XchaneUser } from '../models/xchane.user';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({ providedIn: 'root' })
export class EngagementService {
  constructor(private http: HttpClient) {}

  createEngagement(xchaneUser: XchaneUser) {
    var x = `${environment.apiUrl}`;
    console.log(x);

    return this.http.post<any>(
      `${environment.apiUrl}/api/engagement/`,
      xchaneUser,
      httpOptions
    );

    //return this.http.post('/api/engagement/', xchaneUser, httpOptions);
  }

  verificationAnswer(answer: any, engagementId: any, campaignId: any) {
    return this.http.post<any>(`${environment.apiUrl}/api/engagements/answer`, {
      answer: answer,
      engagementId: engagementId,
      campaignId: campaignId
    });
  }

  getEngagement(engagementId: string) {
    return this.http.get('/api/engagement/' + engagementId);
  }
}
