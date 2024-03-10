import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";

import { map } from 'rxjs/operators';
import { WebsocketSecondService } from './websocket-second.service';


const CHAT_URL = "ws://localhost:8080/ws";

export interface Message {
  [x: string]: any;
  author: string;
  message: string;
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private messagesSubject: Subject<Message>;

  constructor(private wsService: WebsocketSecondService) {

    this.messagesSubject = new Subject<Message>();


   this.wsService.connect(CHAT_URL).subscribe(
    (message: any) => {

      this.messagesSubject.next(message);
    },
    (error: any) => {
      console.error('Error connecting to WebSocket:', error);
    }
  );

  }


  public sendChatMessage(message: Message) {
    //console.log("chat service ", message);

    this.wsService.sendMessage({
      message: message,
    });
  }

  get messages() {
    return this.messagesSubject.asObservable();
  }

  public disconnect(){
    this.wsService.disconnect();
  }


}
