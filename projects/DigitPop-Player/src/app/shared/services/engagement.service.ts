import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {XchaneUser} from '../models/xchane.user';
import {environment} from 'projects/DigitPop-CMS/src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
};

@Injectable({providedIn: 'root'})
export class EngagementService {
  constructor(private http: HttpClient) {
  }

  createEngagement(userId: string, categoryId: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/engagement/`, {
      userId, categoryId
    }, httpOptions);
  }

  verificationAnswer(answer: any, engagementId: any, campaignId: any, isUser: boolean = true) {
    return this.http.post<any>(`${environment.apiUrl}/api/engagements/answer`, {
      answer, engagementId, campaignId, isUser
    });
  }

  getEngagement(engagementId: string) {
    return this.http.get('/api/engagement/' + engagementId);
  }
}
