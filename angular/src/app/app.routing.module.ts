import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { StartComponent } from './pages/start/start.component';
import { PlanningsComponent } from './pages/plannings/plannings.component';
import { PlanoverviewComponent } from './pages/planoverview/planoverview.component';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './pages/login/login.component';
import { OverviewComponent } from './pages/planoverview/overview/overview.component';
import { RouteComponent } from './pages/planoverview/route/route.component';
import { ShareComponent } from './pages/planoverview/share/share.component';
import { StepDetailComponent } from './pages/planoverview/stepdetail/stepdetail.component';
import { ImagesComponent } from './pages/planoverview/images/images.component';
import { RegisterComponent } from './pages/register/register.component';


const appRoutes : Routes = [
  {
    path: '',
    component: StartComponent,
    pathMatch: 'full'
  },{
    path: 'callback',
    component: LoginComponent,
    pathMatch: 'full'
  },{
    path: 'register',
    component: RegisterComponent,
    pathMatch: 'full'
  },
  {
    path: 'plannings',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: PlanningsComponent
  },
  {
    path: 'planoverview/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: PlanoverviewComponent
  },
  {
    path: 'share/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: ShareComponent
  },
  {
    path: 'stepdetails/:planid/:stepid',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: StepDetailComponent
  },
  {
    path: 'images/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: ImagesComponent
  },
  // {
  //   path: 'planoverview/route',
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard],
  //   component: RouteComponent
  // },
]
@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false, useHash: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule  { }
