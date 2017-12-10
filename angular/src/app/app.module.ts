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


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartComponent,
    PlanningsComponent,
    PlanoverviewComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    
    MatAutocompleteModule, MatInputModule, 
    MatFormFieldModule,MatDatepickerModule,
    MatNativeDateModule,MatCardModule,
    MatButtonModule,MatListModule,
    
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
    PlanningService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

