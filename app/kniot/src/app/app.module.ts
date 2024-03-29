import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SideBarComponent } from './components/side-bar/side-bar.component';
import { HomeComponent } from './components/home/home.component';
import { ProfilComponent } from './components/profil/profil.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from './auth.guard';
import { JwtService } from './services/jwt.service';
import { LoginComponent } from './components/login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { StatesService } from './services/states.service';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { SettingPanelComponent } from './components/setting-panel/setting-panel.component';
import { DialogAddComponent } from './components/dialog-add/dialog-add.component';
import { ScenarioComponent } from './components/scenario/scenario.component';
import { DialogUpdateComponent } from './components/dialog-update/dialog-update.component';
import { DialogDeleteComponent } from './components/dialog-delete/dialog-delete.component';
import { HelpComponent } from './components/help/help.component';


import { SpeechRecognition } from '@ionic-native/speech-recognition/ngx';

/** Material Component **/

import { MatButtonModule} from '@angular/material/button';
import { MatToolbarModule} from '@angular/material/toolbar';
import { MatSidenavModule, MatIconModule, MatListModule } from '@angular/material';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatAutocompleteModule } from '@angular/material/';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import {MatCheckboxModule} from '@angular/material/checkbox';





@NgModule({
  declarations: [
    AppComponent,
    SideBarComponent,
    HomeComponent,
    ProfilComponent,
    LoginComponent,
    ControlPanelComponent,
    SettingPanelComponent,
    DialogAddComponent,
    ScenarioComponent,
    DialogUpdateComponent,
    DialogDeleteComponent,
    HelpComponent,
  ],
  entryComponents:[DialogAddComponent,DialogUpdateComponent,DialogDeleteComponent],
  imports: [
    JwtModule.forRoot({
      config: {
        tokenGetter: function  tokenGetter() {
             return     localStorage.getItem('access_token');},
        whitelistedDomains: ['localhost:3000'],
        blacklistedRoutes: ['http://localhost:3000/auth/login']
      }
    }),
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatSliderModule,
    MatMenuModule,
    MatSnackBarModule,
    MatDialogModule,
    MatStepperModule,
    MatAutocompleteModule, 
    MatGridListModule,
    MatSortModule,
    MatTableModule
  ],
  providers: [StatesService,JwtService,AuthGuard,SpeechRecognition],
  bootstrap: [AppComponent]
})
export class AppModule { }
