import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CampaignService {
  constructor(private httpClient: HttpClient) {}

  getCampaign(campaignId: any) {
    return this.httpClient.get(
      `${environment.apiUrl}/api/campaigns/` + campaignId + '/true'
    );
  }

  /** GET Campaign Stats */
  getCampaignStats() {
    return this.httpClient.get(
      `${environment.apiUrl}/api/campaigns/mycampaignStats`
    );
  }

  /** GET Campaign Stats */
  getCampaigns() {
    return this.httpClient
      .get<any>(`${environment.apiUrl}/api/campaigns/mycampaigns`)
      .pipe(
        map((res) => {
          return res;
        })
      );
  }

  increaseProjectViewCount(videoId: any) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/api/projects/` + videoId + `/count/videowatch`,
      null
    );
  }

  // increaseProductClickCount(product: Product) {
  //   return this.httpClient.put<any>(
  //     `${environment.apiUrl}/api/products/` + product._id + `/count/click`,
  //     product
  //   );
  // }

  // increaseProductActionCount(product: Product) {
  //   return this.httpClient.put<any>(
  //     `${environment.apiUrl}/api/products/` + product._id + `/count/buynowclick`,
  //     product
  //   );
  // }

  // increaseProductGroupPauseCount(productGroup: ProductGroup) {
  //   return this.httpClient.put<any>(
  //     `${environment.apiUrl}/api/productGroups/` +
  //       productGroup._id +
  //       `/count/pause`,
  //     productGroup
  //   );
  // }
}


import { CanLoad, Route } from '@angular/router';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

@Injectable({providedIn: 'root'})
export class NameGuard implements CanLoad {
  constructor() { }

  canLoad(route: Route) {
    return true;
  }
}
