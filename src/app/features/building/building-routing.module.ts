import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BuildingComponent } from './building/building.component';
import { AddEditBuildingComponent } from './add-edit-building/add-edit-building.component';
import { BuildingDetailComponent } from './building-detail/building-detail.component';
import { BuildingRoomComponent } from './building-room/building-room.component';

const routes: Routes = [
  {
    path: '',
    component: BuildingComponent
  },
  {
    path: 'add',
    component: AddEditBuildingComponent
  },
  {
    path: 'edit/:id',
    component: AddEditBuildingComponent
  },
  {
    path: ':id',
    component: BuildingDetailComponent
  },
  {
    path: ':buildingId/rooms/:roomId',
    component: BuildingRoomComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuildingRoutingModule { }
