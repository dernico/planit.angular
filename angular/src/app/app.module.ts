import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {
  MatAutocompleteModule, 
  MatInputModule,
  MatFormFieldModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCardModule,
  MatButtonModule,
  MatListModule,
  MatTabsModule,
  MatGridListModule,
  MatToolbarModule,
  MatIconModule,
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './app/app.component';
import { StartComponent } from './pages/start/start.component';
import { PlanningsComponent } from './pages/plannings/plannings.component';
import { PlanoverviewComponent } from './pages/planoverview/planoverview.component';
import { LoginComponent } from './pages/login/login.component';

import {AuthService} from './services/auth.service'
import { HttpInterceptorService } from './services/httpInterceptor.service';
import { PlanningService } from './services/planning.service';
import { Configs } from './configs';
import { OverviewComponent } from './pages/planoverview/overview/overview.component';
import { RouteComponent } from './pages/planoverview/route/route.component';
import { CalendarComponent } from './pages/planoverview/calendar/calendar.component';
import { FileUploadComponent } from './components/fileupload/file-upload.component';
import { FileService } from './services/file.service';
import { FilesComponent } from './pages/planoverview/files/files.component';
import { ShareComponent } from './pages/planoverview/share/share.component';
import { MoneyComponent } from './pages/planoverview/money/money.component';
import { PlacesInputComponent } from './components/places-input/places-input.component';
import { StepDetailComponent } from './pages/planoverview/stepdetail/stepdetail.component';
import { ImagesComponent } from './pages/planoverview/images/images.component';
import { HttpSrcDirective } from './directives/httpSrc/httpSrc.directive';
import { RegisterComponent } from './pages/register/register.component';


@NgModule({
  declarations: [
    FileUploadComponent,
    PlacesInputComponent,

    HttpSrcDirective,
    AppComponent,
    LoginComponent,
    RegisterComponent,
    StartComponent,
    PlanningsComponent,
    PlanoverviewComponent,
    StepDetailComponent,
    OverviewComponent,
    RouteComponent,
    CalendarComponent,
    FilesComponent,
    ImagesComponent,
    ShareComponent,
    MoneyComponent
  ],
  imports: [
    BrowserAnimationsModule,
    
    MatAutocompleteModule, MatInputModule, 
    MatFormFieldModule,MatDatepickerModule,
    MatNativeDateModule,MatCardModule,
    MatButtonModule,MatListModule,
    MatTabsModule, MatGridListModule,
    MatToolbarModule, MatIconModule,
    
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    AgmCoreModule.forRoot({
      apiKey: Configs.mapsApiKey
    })
  ],
  providers: [
    AuthGuard,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    },
    PlanningService,
    FileService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }