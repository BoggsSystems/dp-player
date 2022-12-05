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
  cacheMap: Map<string, Observable<ProjectMedia[]>> = new Map();

  constructor(private httpClient: HttpClient) {
  }

  getVideos = (categories: string[]): Observable<ProjectMedia[]> => {
    this.cachedVideo$ = this.cacheMap.has(categories.toString()) ? this.cacheMap.get(categories.toString()) : null;
    if (!this.cachedVideo$) {
      let params = new HttpParams();
      params = categories.length ? params.append('categories', categories.join(',')) : null;
      this.cachedVideo$ = this.httpClient.get(this.endpoint, {params})
        .pipe(map((response: any) => {
          return this.secondsToMMSS(response);
        }), shareReplay(1));
      this.cacheMap.set(categories.toString(), this.cachedVideo$);
    }
    return this.cachedVideo$;
  }

  getActiveCategories = (): Observable<Category[]> => {
    const categories = this.httpClient.get(`${this.endpoint}/categories`)
      .pipe(map((response: Category[]) => response), shareReplay(1));
    return categories;
  }

  private secondsToMMSS = (videos: ProjectMedia[]) => {
    const padWithZero = (time: number) => time.toString().padStart(2, '0');
    const timestamp = (seconds: number) => {
      const minutes = (seconds - (seconds % 60)) / 60;
      const remainingSeconds = Math.round(seconds % 60);
      return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
    };
    return videos.map(video => {
      video.media.duration = timestamp(+video.media.duration);
      return video;
    });
  }

}
