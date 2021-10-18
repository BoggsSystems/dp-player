import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private httpClient: HttpClient) {}

  getCategories() {
    return this.httpClient.get(`${environment.apiUrl}/api/categories`);
  }
}
