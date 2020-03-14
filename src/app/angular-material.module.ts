import { NgModule } from '@angular/core';
import {
  MatPaginatorModule,
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatDialogModule,
} from "@angular/material";

@NgModule({
  exports:[
    MatPaginatorModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatDialogModule,
  ]
})
export class AngularMaterialModule {}
