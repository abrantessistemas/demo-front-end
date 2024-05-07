import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { EnderecoService } from './model/endereco.service';
import { EnderecosComponent } from './enderecos.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { EnderecosCreateUpdateModule } from './enderecos-create-update/enderecos-create-update.module';


@NgModule({
  declarations: [
    EnderecosComponent,
  ],
  imports: [
    CommonModule,
    EnderecosCreateUpdateModule,
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
    EnderecosComponent

  ],
  providers: [
    EnderecoService
  ]
})
export class EnderecosModule { }
