import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import { map } from 'rxjs/operators';


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

  constructor(private wsService: WebsocketService) {

    this.messagesSubject = new Subject<Message>();
  //   this.messages = <Subject<Message>>wsService.connect(CHAT_URL).pipe(
  //     map((response: MessageEvent): Message => {
  //        let data = JSON.parse(response.data);
  //        console.log("data ",data);

  //        return {
  //           author: data.author,
  //           message: data.message
  //        };
  //     })
  //  );

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
    console.log("chat service ", message);

    this.wsService.sendMessage({
      message: message,
    });
  }

  get messages() {
    return this.messagesSubject.asObservable();
  }


}
