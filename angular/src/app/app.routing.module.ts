import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { StartComponent } from './components/start/start.component';
import { PlanningsComponent } from './components/plannings/plannings.component';
import { PlanoverviewComponent } from './components/planoverview/planoverview.component';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { OverviewComponent } from './components/planoverview/overview/overview.component';
import { RouteComponent } from './components/planoverview/route/route.component';


const appRoutes : Routes = [
  {
    path: '',
    component: StartComponent,
    pathMatch: 'full'
  },{
    path: 'callback',
    component: LoginComponent,
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
  // {
  //   path: 'planoverview/overview',
  //   pathMatch: 'full',
  //   canActivate: [AuthGuard],
  //   component: OverviewComponent
  // },
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
      { enableTracing: false } // <-- debugging purposes only
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule  { }
