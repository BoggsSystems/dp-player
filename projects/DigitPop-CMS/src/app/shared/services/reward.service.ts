import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP_XCHANE_AUTH} from '../../app.module';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';
import {Reward} from '../models/reward';
import {map, shareReplay} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({providedIn: 'root'})

export class RewardService {
  readonly endpoint = `${environment.apiUrl}/api/rewards`;
  cachedRewards$: Observable<Reward[]>;

  constructor(@Inject(HTTP_XCHANE_AUTH) private http: HttpClient) {
  }

  getRewards = () => {
    if (!this.cachedRewards$) {
      this.cachedRewards$ = this.http.get(this.endpoint)
        .pipe(map((response: any) => {
          return response;
        }), shareReplay(1));
    }
    return this.cachedRewards$;
  }
}
