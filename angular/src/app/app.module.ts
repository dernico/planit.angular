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

import { AppRoutingModule } from './app.routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthGuard } from './auth.guard';

import { AppComponent } from './components/app/app.component';
import { StartComponent } from './components/start/start.component';
import { PlanComponent } from './components/plan/plan.component';
import { PlanDetailComponent } from './components/plandetail/plandetail.component';
import { LoginComponent } from './components/login/login.component';

import {AuthService} from './services/auth.service'
import { HttpInterceptorService } from './services/httpInterceptor.service';
import { PlanningService } from './services/planning.service';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StartComponent,
    PlanComponent,
    PlanDetailComponent,
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
    AppRoutingModule
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
