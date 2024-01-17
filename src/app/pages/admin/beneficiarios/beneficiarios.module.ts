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
import { BeneficiariosCreateUpdateModule } from './beneficiarios-create-update/beneficiarios-create-update.module';
import { BeneficiariosComponent } from './beneficiarios.component';
import { BeneficiarioService } from './model/beneficiario.service';


@NgModule({
  declarations: [
    BeneficiariosComponent,
  ],
  imports: [
    CommonModule,
    BeneficiariosCreateUpdateModule,
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
    BeneficiariosComponent

  ],
  providers: [
    BeneficiarioService,
    DatePipe
  ]
})
export class BeneficiariosModule { }
