import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EmpresaService } from './model/empresa.service';
import { EmpresasComponent } from './empresas.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { EmpresasCreateUpdateModule } from './empresas-create-update/empresas-create-update.module';


@NgModule({
  declarations: [
    EmpresasComponent,
  ],
  imports: [
    CommonModule,
    EmpresasCreateUpdateModule,
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
    EmpresasComponent

  ],
  providers: [
    EmpresaService
  ]
})
export class EmpresasModule { }
