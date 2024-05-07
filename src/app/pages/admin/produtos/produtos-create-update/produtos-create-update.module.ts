import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { ProdutosCreateUpdateComponent } from './produtos-create-update.component';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    ProdutosCreateUpdateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTabsModule,
    PipesModule,
    MatListModule,
    MatSelectModule
  ]
})
export class ProdutosCreateUpdateModule { }
