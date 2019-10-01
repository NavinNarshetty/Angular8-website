import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { HttpClientModule } from "@angular/common/http";
import { LoaderComponent } from './loader/loader.component';
import { AuthGaurd } from './auth/auth.gaurd';
import { StoreModule } from '@ngrx/store';
import * as fromApp from './store/app.reducer'


const appRouter: Routes = [{
  path: 'login',
  component: AuthComponent
}, {
  path: 'sign-up',
  component: AuthComponent
}, {
  path: 'welcome',
  component: WelcomeComponent,
  canActivate: [AuthGaurd]
}]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    WelcomeComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRouter),
    StoreModule.forRoot(fromApp.appReducer)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
