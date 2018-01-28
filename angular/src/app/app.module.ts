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
} from '@angular/material';

import { AgmCoreModule } from '@agm/core';

import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './components/app/app.component';
import { StartComponent } from './components/start/start.component';
import { PlanningsComponent } from './components/plannings/plannings.component';
import { PlanoverviewComponent } from './components/planoverview/planoverview.component';
import { LoginComponent } from './components/login/login.component';

import {AuthService} from './services/auth.service'
import { HttpInterceptorService } from './services/httpInterceptor.service';
import { PlanningService } from './services/planning.service';
import { Configs } from './configs';
import { OverviewComponent } from './components/planoverview/overview/overview.component';
import { RouteComponent } from './components/planoverview/route/route.component';
import { CalendarComponent } from './components/planoverview/calendar/calendar.component';
import { FileUploadComponent } from './components/helper/file-upload.component';
import { FileService } from './services/file.service';
import { FilesComponent } from './components/planoverview/files/files.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartComponent,
    PlanningsComponent,
    PlanoverviewComponent,
    OverviewComponent,
    RouteComponent,
    CalendarComponent,
    FileUploadComponent,
    FilesComponent
  ],
  imports: [
    BrowserAnimationsModule,
    
    MatAutocompleteModule, MatInputModule, 
    MatFormFieldModule,MatDatepickerModule,
    MatNativeDateModule,MatCardModule,
    MatButtonModule,MatListModule,
    MatTabsModule,
    
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
