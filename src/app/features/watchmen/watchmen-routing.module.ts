import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { watchmenComponent } from './watchmen/watchmen.component';
import { watchmenDetailComponent } from './watchmen-detail/watchmen-detail.component';
import { AddEditwatchmenComponent } from './add-edit-watchmen/add-edit-watchmen.component';

const routes: Routes = [
  {
    path: '',
    component: watchmenComponent
  },
  {
    path: 'add',
    component: AddEditwatchmenComponent
  },
  {
    path: 'edit/:id',
    component: AddEditwatchmenComponent
  },
  {
    path: ':watchmenId',
    component: watchmenDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class watchmenRoutingModule { }
