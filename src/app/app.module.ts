import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { Http, HttpModule, JsonpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Router } from '@angular/router';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

import { MatButtonModule, MatListModule, MatIconModule, MatCardModule, MatMenuModule, MatInputModule, MatButtonToggleModule,
         MatProgressSpinnerModule, MatSelectModule, MatSlideToggleModule, MatDialogModule, MatSnackBarModule, MatToolbarModule,
         MatTabsModule, MatSidenavModule, MatTooltipModule, MatRippleModule, MatRadioModule, MatGridListModule,
         MatDatepickerModule, MatNativeDateModule, MatSliderModule, MatAutocompleteModule, MatSnackBar } from '@angular/material';

import { CovalentCommonModule, CovalentLayoutModule, CovalentMediaModule, CovalentExpansionPanelModule,
         CovalentStepsModule, CovalentLoadingModule, CovalentDialogsModule, CovalentSearchModule, CovalentPagingModule,
         CovalentNotificationsModule,
         CovalentMenuModule, CovalentDataTableModule, CovalentMessageModule, TdMediaService, TdLoadingService } from '@covalent/core';
import { CovalentMarkdownModule } from '@covalent/markdown';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestoreModule, AngularFirestore } from 'angularfire2/firestore';
import { FIREBASE_CONFIG } from '../environments/environment.prod';
import { FirebaseService } from './services/firebase.service';
import { LoginComponent } from './components/login/login.component';
import * as firebase from 'firebase/app';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { CardOverComponent } from './components/card-over/card-over.component';
import { CardOverLandingPageComponent } from './components/landing-page/card-over-landing-page.component';
import { APP_BASE_HREF } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';

@NgModule({
  imports:      [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'welcome', pathMatch: 'full' },
      { path: 'welcome', component: CardOverLandingPageComponent, pathMatch: 'full' },
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent, pathMatch: 'full' }
    ]),
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFirestoreModule,
    HttpClientModule,
    JsonpModule,
    /** Material Modules */
    MatButtonModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatTabsModule,
    MatSidenavModule,
    MatTooltipModule,
    MatRippleModule,
    MatRadioModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSliderModule,
    MatAutocompleteModule,
    /** Covalent Modules */
    CovalentCommonModule,
    CovalentLoadingModule,
    CovalentLayoutModule,
    CovalentMediaModule,
    CovalentExpansionPanelModule,
    CovalentStepsModule,
    CovalentDialogsModule,
    CovalentLoadingModule,
    CovalentSearchModule,
    CovalentPagingModule,
    CovalentNotificationsModule,
    CovalentMenuModule,
    CovalentMarkdownModule,
    CovalentDataTableModule,
    CovalentMessageModule,
    ServiceWorkerModule.register('/combined-sw.js', { enabled: environment.production }),
    ],
  providers: [AngularFireAuth, AngularFirestore, FirebaseService,
    { provide: 'LoadingSvc', useClass: TdLoadingService },
  { provide: APP_BASE_HREF, useValue: window['_app_base'] || '/' }],
  declarations: [ AppComponent, HelloComponent,
    LoginComponent, DashboardComponent,
    LandingPageComponent, CardOverComponent, CardOverLandingPageComponent ],
  bootstrap:    [ CardOverComponent ]
})
export class AppModule { }
