'use strict';

import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';
import { AnonymousSubject } from 'rxjs/internal/Subject';
import { share } from 'rxjs/operators';
import {environment} from '../../../environments/environment';

const WS = environment.websocketURL;

export interface Message {
  trigger: string;
  value: any;
}

@Injectable()
/**
 * Service to handle WebSocket connections and message passing.
 */
export class WebsocketService {
  /**
   * Subject for sending and receiving WebSocket messages.
   */
  public messages: Subject<Message>;
  private userId = '';
  private subject: AnonymousSubject<MessageEvent>;

  /**
   * Initializes the WebSocket connection and sets up the message Subject.
   * @param userId The ID of the user connecting to the WebSocket.
   */
  constructor(userId: string) {
    this.userId = userId;
    this.connect(WS, this.userId).subscribe();
  }

  /**
   * Connects to the WebSocket server and returns an Observable for receiving messages.
   * @param url The WebSocket server URL.
   * @param userId The ID of the user connecting to the WebSocket.
   * @returns An Observable for receiving WebSocket messages.
   */
  private connect(url: string, userId: string): Observable<Message> {
    const ws = new WebSocket(url + '/' + userId, [userId + '-player']);

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
