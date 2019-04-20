import { Component, ViewChildren, QueryList } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { JwtService } from '../../services/jwt.service';
import { MatSidenavModule } from '@angular/material';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css']
})
export class SideBarComponent {
  @ViewChildren('drawer') sc: QueryList<MatSidenavModule>;
  
  nameComponent : String;

  ngInit(){
    this.nameComponent = 'Accueil';
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver,private auth: JwtService, private router: Router) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['login']);
  }
}
