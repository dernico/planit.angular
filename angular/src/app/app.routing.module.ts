import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { StartComponent } from './components/start/start.component';
import { PlanComponent } from './components/plan/plan.component';
import { PlanDetailComponent } from './components/plandetail/plandetail.component';

import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';


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
    path: 'plan',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: PlanComponent
  },
  {
    path: 'plan/:id',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: PlanDetailComponent
  },
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
