import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CategoriaService } from './model/categoria.service';
import { CategoriasComponent } from './categorias.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { CategoriasCreateUpdateModule } from './categorias-create-update/categorias-create-update.module';


@NgModule({
  declarations: [
    CategoriasComponent,
  ],
  imports: [
    CommonModule,
    CategoriasCreateUpdateModule,
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
    CategoriasComponent

  ],
  providers: [
    CategoriaService
  ]
})
export class CategoriasModule { }
