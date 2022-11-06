import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Project } from '../models/project';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  constructor(private httpClient: HttpClient) {}

  addProject(project: any) {
    return this.httpClient.post<any>(`${environment.apiUrl}/api/projects`, {
      project,
    });
  }

  updateProject(project: Project) {
    return this.httpClient.put<any>(`${environment.apiUrl}/api/projects/` + project._id,  {
      project,
    });
  }

  updateProjectProductGroups(project: Project) {
    return this.httpClient.put<any>(`${environment.apiUrl}/api/projects/` + project._id + '/updateProductGroups',  {
      project,
    });
  }

  sendEmail(email: any) {
    return this.httpClient.post<any>(
      `${environment.apiUrl}/api/projects/email`,
      { email }
    );
  }

  getProjects() {
    return this.httpClient.get(`${environment.apiUrl}/api/projects`);
  }

  getProject(id:any) {
    return this.httpClient.get(`${environment.apiUrl}/api/projects/` + id + '/true');
  }

  getMyProjects() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/api/projects/myprojects`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  getPublishedProjects() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/projects?activeOnly=true`
    );
  }

  getPublishedProjectsByCategory(category : any) {
    return this.httpClient.get(`${environment.apiUrl}/api/projects?activeOnly=true&category=` + category);
  }

}
