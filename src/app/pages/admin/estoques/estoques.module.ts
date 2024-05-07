import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EstoqueService } from './model/estoque.service';
import { EstoquesComponent } from './estoques.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { EstoquesCreateUpdateModule } from './estoques-create-update/estoques-create-update.module';


@NgModule({
  declarations: [
    EstoquesComponent,
  ],
  imports: [
    CommonModule,
    EstoquesCreateUpdateModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatDialogModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatSnackBarModule,
    MatButtonModule
  ],
  exports: [
    EstoquesComponent

  ],
  providers: [
    EstoqueService
  ]
})
export class EstoquesModule { }
