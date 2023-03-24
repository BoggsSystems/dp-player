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

  createEngagement(userId: string, campaignId: string, projectId: string) {
    return this.http.post<any>(`${environment.apiUrl}/api/engagement/`, {
      userId, campaignId, projectId
    }, httpOptions);
  }

  verificationAnswer(answer: any, engagementId: any, campaignId: any, isUser: boolean = true, uuid: string = '') {
    return this.http.post<any>(`${environment.apiUrl}/api/engagements/answer`, {
      answer, engagementId, campaignId, isUser, uuid
    }, httpOptions);
  }

  getEngagement(engagementId: string) {
    return this.http.get('/api/engagement/' + engagementId);
  }
}
