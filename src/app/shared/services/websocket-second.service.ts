import { Injectable } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketSecondService {
  private subject!: Subject<MessageEvent>;
  private socket!: WebSocket;
  private url!: string;
  private reconnectAttempts: number = 0;
  private readonly maxReconnectAttempts: number = 5;

  constructor() {}

  public connect(url:any): Subject<MessageEvent> {
    this.url = url;
    if (!this.subject || this.socket.readyState !== WebSocket.OPEN) {
      this.subject = this.create(url);
      console.log("Successfully connected: " + url);
    }
    return this.subject;
  }

  private create(url:any): Subject<MessageEvent> {
    this.socket = new WebSocket(url);

    let observable = new Observable((obs: Observer<MessageEvent>) => {
      this.socket.onmessage = obs.next.bind(obs);
      this.socket.onerror = obs.error.bind(obs);
      this.socket.onclose = (event: CloseEvent) => {
        if (event.code !== 1000) {
          // Connection closed unexpectedly, attempt to reconnect
          this.reconnect();
        } else {
          obs.complete.bind(obs);
        }
      };
      return () => this.socket.close();
    });

    let observer = {
      next: (data: Object) => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send(JSON.stringify(data));
        }
      }
    };

    return Subject.create(observer, observable);
  }


  public sendMessage(message: any) {
    console.log("Websocket service ",message);
    console.log("Websocket service ",this.socket.readyState === WebSocket.OPEN);

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(message));
    } else {
      console.error('WebSocket not open. Unable to send message.');
    }
  }

  private reconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(this.url), 2000); // Retry after 2 seconds
    } else {
      console.error('Max reconnection attempts reached. Closing connection.');
      this.subject.complete();
    }
  }

  public disconnect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
      this.subject.complete();
      console.log('WebSocket disconnected.');
    }
  }
}
