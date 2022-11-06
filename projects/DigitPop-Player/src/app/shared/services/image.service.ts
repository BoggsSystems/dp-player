import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HTTP_NOBILLS } from '../../app.module';
import { environment } from 'projects/DigitPop-CMS/src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ImageService {
  constructor(@Inject(HTTP_NOBILLS) private httpClient: HttpClient) {}
  //constructor(private httpClient: HttpClient) {}

  upload(file: File) {
    const fd = new FormData();
    fd.append('upload_preset', environment.CLOUDINARY_UPLOAD_PRESET);
    fd.append('file', file);

    return this.httpClient.post<any>(
      `https://api.cloudinary.com/v1_1/${environment.CLOUDINARY_CLOUD_NAME}/image/upload`,
      fd,
      {
        reportProgress: true,
        observe: 'events',
      }
    );
  }
}
