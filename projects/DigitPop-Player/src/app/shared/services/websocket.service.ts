import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import {map, share} from 'rxjs/operators';

const WS = 'wss://production-digitpop-server.herokuapp.com';

export interface Message {
  trigger: string;
  value: any;
}

@Injectable()
export class WebsocketService {
  public messages: Subject<Message>;
  private userId = '';
  private subject: AnonymousSubject<MessageEvent>;

  constructor(userId: string) {
    this.userId = userId;
    this.connect(WS, this.userId).subscribe();
  }

  private connect(url: string, userId: string): Observable<Message> {
    const ws = new WebSocket(url + '/' + userId, [userId + '-second']);

    const observable = new Observable<Message>((obs: Observer<Message>) => {
      ws.onmessage = (event) => obs.next(JSON.parse(event.data));
      ws.onerror = (event) => obs.error(event);
      ws.onclose = (event) => obs.complete();
      return () => {
        if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
          ws.close();
        }
      };
    }).pipe(share());

    return observable;
  }

}
