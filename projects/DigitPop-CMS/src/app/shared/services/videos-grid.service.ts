import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ProjectMedia} from '../models/ProjectMedia';
import {Category} from '../models/category';

@Injectable({
  providedIn: 'root'
})

export class VideosGridService {
  readonly endpoint = `${environment.apiUrl}/api/videos`;
  cachedVideo$: Observable<ProjectMedia[]>;

  constructor(private httpClient: HttpClient) {
  }

  getVideos = (categories: string[]): Observable<ProjectMedia[]> => {
    if (!this.cachedVideo$) {
      let params = new HttpParams();
      params = categories.length ? params.append('categories', categories.join(',')) : null;
      this.cachedVideo$ = this.httpClient.get(this.endpoint, {params})
        .pipe(map((response: any) => response), shareReplay(1));
    }
    return this.cachedVideo$;
  }

  getActiveCategories = (): Observable<Category[]> => {
    const categories = this.httpClient.get(`${this.endpoint}/categories`)
      .pipe(map((response: Category[]) => response), shareReplay(1));
    return categories;
  }

}
