import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppHttpService } from './services/app-http.service';
import { HttpModule } from '@angular/http';

const appRoutes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }
];

import { AppComponent } from './app.component';

import { RestaurantsModule } from "./restaurants/restaurant.module";
import { UserModule } from "./user/user.module";


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RestaurantsModule,
    UserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    AppHttpService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
