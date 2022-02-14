import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { EasyWebPhotoModule } from './easy-web-photo/easy-web-photo.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    EasyWebPhotoModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
