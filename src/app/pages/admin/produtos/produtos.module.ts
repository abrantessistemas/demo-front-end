import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { ProdutoService } from './model/produto.service';
import { ProdutosComponent } from './produtos.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { ProdutosCreateUpdateModule } from './produtos-create-update/produtos-create-update.module';


@NgModule({
  declarations: [
    ProdutosComponent,
  ],
  imports: [
    CommonModule,
    ProdutosCreateUpdateModule,
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
    ProdutosComponent

  ],
  providers: [
    ProdutoService
  ]
})
export class ProdutosModule { }
