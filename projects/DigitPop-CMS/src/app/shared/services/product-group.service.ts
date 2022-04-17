import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProductGroup } from '../models/productGroup';
import { Project } from '../models/project';
import * as _ from 'lodash';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductGroupService {
  constructor(private httpClient: HttpClient) {}

  createProductGroup(project: Project, pg: ProductGroup) {
    var temp = { projectId: project._id };
    var body = _.assign(pg, temp);

    return this.httpClient.post<any>(
      `${environment.apiUrl}/api/productGroups/`,
      body
    );
  }

  updateProductGroupDeleteProduct(productGroup: ProductGroup) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/api/productGroups/` + productGroup._id + `/deleteProduct`,
      productGroup
    );
  }

  updateProductGroup(productGroup: ProductGroup) {
    return this.httpClient.put<any>(
      `${environment.apiUrl}/api/productGroups/` + productGroup._id,
      productGroup
    );
  }

  deleteProductGroup(productGroup: ProductGroup) {
    return this.httpClient.delete<any>(
      `${environment.apiUrl}/api/productGroups/` + productGroup._id
    );
  }

  getProductGroup(groupId: any) {
    console.log('is');
    return this.httpClient
    .get(`${environment.apiUrl}/api/productGroups/${groupId}`)
    .pipe(publishReplay(1), refCount());
  }
}
