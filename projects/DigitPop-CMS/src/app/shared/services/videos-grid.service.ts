import {environment} from '../../../environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {ProjectMedia} from '../models/ProjectMedia';

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
      params = params.append('categories', categories.join(','));
      this.cachedVideo$ = this.httpClient.get(this.endpoint, {params})
        .pipe(map((response: any) => response), shareReplay(1));
    }
    return this.cachedVideo$;
  }

}
