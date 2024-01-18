import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentosCreateUpdateModule } from './documentos-create-update/documentos-create-update.module';
import { DocumentosComponent } from './documentos.component';
import { DocumentoService } from './model/documento.service';


@NgModule({
  declarations: [
    DocumentosComponent,
  ],
  imports: [
    CommonModule,
    DocumentosCreateUpdateModule,
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
    DocumentosComponent

  ],
  providers: [
    DocumentoService,
    DatePipe
  ]
})
export class DocumentosModule { }
