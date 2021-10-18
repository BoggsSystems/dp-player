import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HTTP_XCHANE_AUTH } from '../../app.module';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  categoryList$: Observable<Object>;

  constructor(@Inject(HTTP_XCHANE_AUTH) private httpClient: HttpClient) {}

  getCategories() {
    if (!this.categoryList$) {
      this.categoryList$ = this.httpClient
        .get(`${environment.apiUrl}/api/categories`)
        .pipe(shareReplay(1));
    }
    return this.categoryList$;
  }

}
