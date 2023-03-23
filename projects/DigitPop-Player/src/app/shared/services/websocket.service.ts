import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { map } from 'rxjs/operators';

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
    this.messages = this.connect(WS + '/' + this.userId, this.userId).pipe(map((response: MessageEvent): Message => {
      console.log(JSON.parse(response.data));
      return JSON.parse(response.data);
    })) as BehaviorSubject<Message>;
  }

  private connect(url: string, userId: string): AnonymousSubject<MessageEvent> {
    if (!this.subject) {
      this.subject = this.create(url, userId);
    }
    return this.subject;
  }

  private create(url: string, userId: string): AnonymousSubject<MessageEvent> {
    const ws = new WebSocket(url, [userId]);

    const observable = new Observable((obs: Observer<MessageEvent>) => {
      ws.onmessage = obs.next.bind(obs);
      ws.onerror = obs.error.bind(obs);
      ws.onclose = obs.complete.bind(obs);
      return ws.close.bind(ws);
    });

    const observer: any = {
      error: null, complete: null,
      next: (data: Object) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      }
    };

    return new AnonymousSubject<MessageEvent>(observer, observable);
  }
}
