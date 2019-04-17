import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SettingPanelComponent } from './components/setting-panel/setting-panel.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  { path: '',  redirectTo: 'home', pathMatch: 'full',canActivate:[AuthGuard] },
  { path: 'home', component: HomeComponent,canActivate:[AuthGuard] },
  { path: 'setting', component: SettingPanelComponent,canActivate:[AuthGuard] },
  { path: 'scenario', component: ScenarioComponent,canActivate:[AuthGuard] },
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
