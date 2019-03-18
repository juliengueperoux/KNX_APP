import { Component } from '@angular/core';
import 'hammerjs';
import { Router } from '@angular/router';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todoApp';
  constructor(private auth: JwtService, private router: Router) { }

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
