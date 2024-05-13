import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ContaPagarService } from './model/conta-pagar.service';
import { ContasPagarComponent } from './contas-pagar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { ContasPagarCreateUpdateModule } from './contas-pagar-create-update/contas-pagar-create-update.module';


@NgModule({
  declarations: [
    ContasPagarComponent
  ],
  imports: [
    CommonModule,
    ContasPagarCreateUpdateModule,
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
    ContasPagarComponent

  ],
  providers: [
    ContaPagarService
  ]
})
export class ContasPagarModule { }
