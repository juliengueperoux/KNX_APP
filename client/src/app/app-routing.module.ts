import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfilComponent } from './profil/profil.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '',  redirectTo: 'home', pathMatch: 'full',canActivate:[AuthGuard] },
  { path: 'home', component: HomeComponent,canActivate:[AuthGuard] },
  { path: 'profil', component: ProfilComponent,canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
