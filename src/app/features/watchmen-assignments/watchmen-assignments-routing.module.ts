import { AddEditWatchmenAssignmentsComponent } from './add-edit-watchmen-assignments/add-edit-watchmen-assignments.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WatchmenAssignmentsComponent } from './watchmen-assignments/watchmen-assignments.component';

const routes: Routes = [
  {
    path: '',
    component: WatchmenAssignmentsComponent,
  },
  {
    path: 'add',
    component: AddEditWatchmenAssignmentsComponent,
  },
  {
    path: 'edit/:id',
    component: AddEditWatchmenAssignmentsComponent,
  },
  // {
  //   path: ':watchmenId',
  //   component: watchmenDetailComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WatchmenAssignmentsRoutingModule {}
