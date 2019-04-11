import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class StatesService {
    private url = 'http://localhost:3001';
    private socket;
    observable:Observable<string>;

    constructor() {
    }

    login(){
      this.socket = io(this.url);
      this.socket.on('connect', function (newSocket) {
        this.emit('authenticate', {token: localStorage.getItem('access_token')}) //send the jwt
        this.on('authenticated', function () {
          })
          
      });
      this.socket.on('disconnect', function (newSocket) {
        localStorage.removeItem('access_token');
      });
    }

    public sendMessage(message) {
        this.socket.emit('new-message', message);
    }

    public  getMessages():Observable<string>{
      return  this.observable=new Observable((observer)=>{
        this.socket.on('hello',(data)=>{observer.next(data)}
      );}) 
    }

    public socketCreated(){
      return this.socket != null
    }
}