import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataService {
  private subjectName = new Subject<any>();

  constructor() {
  }

  updateUserCredit(points: number) {
    this.subjectName.next({points});
  }

  getUserCredit(): Observable<any> {
    return this.subjectName.asObservable();
  }
}
