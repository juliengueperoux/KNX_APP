import * as io from 'socket.io-client';
import { Observable } from 'rxjs';

export class StatesService {
    private url = 'http://localhost:3001';
    private socket;

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

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
            this.socket.on("error", function(error) {
                if (error.type == "UnauthorizedError" || error.code == "invalid_token") {
                  // redirect user to login page perhaps?
                  console.log("User's token has expired");
                }
              });
        });
    }

    public socketCreated(){
      return this.socket != null
    }
}