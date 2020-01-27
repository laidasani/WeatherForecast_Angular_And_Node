import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {DataService} from './data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import {NgbModule, NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {MatAutocompleteModule} from '@angular/material/autocomplete';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { HttpClientModule } from '@angular/common/http';
import { ResponsiveComponent } from './responsive/responsive.component';


@NgModule({
  declarations: [
    AppComponent,
    FormComponent,
    ResponsiveComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ChartsModule,
    MatAutocompleteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
