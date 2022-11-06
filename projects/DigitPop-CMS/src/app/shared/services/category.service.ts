import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HTTP_XCHANE_AUTH } from '../../app.module';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categoryList$: Observable<Object>;
  userCategoryList$: Observable<Object>;

  constructor(@Inject(HTTP_XCHANE_AUTH) private httpClient: HttpClient) {}

  getCategories() {
    if (!this.categoryList$) {
      this.categoryList$ = this.httpClient
        .get(`${environment.apiUrl}/api/categories`);
        }
    return this.categoryList$;
  }

  getUserCategories() {
    if (!this.userCategoryList$) {
      this.userCategoryList$ = this.httpClient
        .get(`${environment.apiUrl}/api/categories/user`);
         }
    return this.userCategoryList$;
  }
}
