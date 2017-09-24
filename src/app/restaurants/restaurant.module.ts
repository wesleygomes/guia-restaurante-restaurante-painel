import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { RestaurantService } from './../services/restaurant.service';
import { DishesService } from "../services/dishes.service";

import { DashboardComponent } from "./dashboard/dashboard.component";
import { EvaluationComponent } from "./dashboard/evaluation.component";
import { DishesComponent } from "./dishes/dishes.component";

import { EditComponent } from "./edit.component";
import { NewDisheComponent } from "./dishes/new-dishe.component";
import { EditDisheComponent } from "./dishes/edit-dishe.component";

const appRoutes: Routes = [
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'evaluation/:id', component: EvaluationComponent }
    ]
  },
  {
    path: 'dishes', component: DishesComponent,
    children: [
      { path: 'new', component: NewDisheComponent },
      { path: 'edit/:id', component: EditDisheComponent },
    ]
  },
  { path: 'edit', component: EditComponent },
];

@NgModule({
  declarations: [
    DashboardComponent,
    EvaluationComponent,
    DishesComponent,
    EditComponent,
    NewDisheComponent,
    EditDisheComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    RestaurantService, 
    DishesService
  ]
})

export class RestaurantsModule { }
