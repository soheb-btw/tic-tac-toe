import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';;
import { AppComponent } from './app.component';
import { SubGridComponent } from './sub-grid/sub-grid.component';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    AppComponent,
    SubGridComponent,
    DialogContentComponent
  ],
  imports: [
    BrowserModule,MatDialogModule,MatButtonModule,MatIconModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
