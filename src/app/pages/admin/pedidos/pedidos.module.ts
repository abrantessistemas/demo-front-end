import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { PedidoService } from './model/pedido.service';
import { PedidosComponent } from './pedidos.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { PedidosCreateUpdateModule } from './pedidos-create-update/pedidos-create-update.module';


@NgModule({
  declarations: [
    PedidosComponent,
  ],
  imports: [
    CommonModule,
    PedidosCreateUpdateModule,
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
    PedidosComponent

  ],
  providers: [
    PedidoService
  ]
})
export class PedidosModule { }
