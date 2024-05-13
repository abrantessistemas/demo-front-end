import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ContaReceberService } from './model/conta-receber.service';
import { ContasReceberComponent } from './contas-receber.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { ContasReceberCreateUpdateModule } from './contas-receber-create-update/contas-receber-create-update.module';


@NgModule({
  declarations: [
    ContasReceberComponent
  ],
  imports: [
    CommonModule,
    ContasReceberCreateUpdateModule,
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
    ContasReceberComponent

  ],
  providers: [
    ContaReceberService
  ]
})
export class ContasReceberModule { }
