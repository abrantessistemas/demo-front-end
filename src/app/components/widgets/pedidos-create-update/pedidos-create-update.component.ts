import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EstoqueModel } from 'src/app/pages/admin/estoques/model/estoque.model';
import { PedidoModel } from 'src/app/pages/admin/pedidos/model/pedido.model';
import { PedidoService } from 'src/app/pages/admin/pedidos/model/pedido.service';

@Component({
  selector: 'abs-pedidos-create-update',
  templateUrl: './pedidos-create-update.component.html',
  styleUrls: ['./pedidos-create-update.component.scss']
})
export class PedidosCreateUpdateComponent {
  pedidoForm!: FormGroup;
  estoques!: EstoqueModel[];
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';
  categorias: any[] = [{ nome: 'Informatica' }, { nome: 'acessorios' }];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: PedidoModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<PedidosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private pedidoService: PedidoService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as PedidoModel;
      this.defaults.id = 1;
    }

    this.pedidoForm = this.fb.group({
      id: this.defaults.id || '',
      nome: this.defaults.nome,
      // descricao: this.defaults.descricao,
      // precoCompra: this.defaults.precoCompra,
      // precoRevenda: this.defaults.precoRevenda,
      // precoTotalEstoque: this.defaults.precoTotalEstoque,
      // quatidadeEstoque: this.defaults.quatidadeEstoque,
      // codigoBarras: this.defaults.codigoBarras,
      // sku: this.defaults.sku,
      // imageUrl: this.defaults.imageUrl,
      // estoque: this.defaults.estoque,
      // categorias: this.defaults.categoria,
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createPedido();
    } else if (this.mode === 'update') {
      this.updatePedido();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createPedido() {
    const pedido = this.pedidoForm.value;
    // this.productService.addProduct(pedido);
    // this.subscription.add(
    //   this.pedidoService.create(pedido).subscribe(
    //     (result) => {
    //       this.snackbar.open(
    //         'Pedido ' +
    //         result.nome +
    //         ' successfully created.',
    //         'OK',
    //         {
    //           duration: 5000,
    //         }
    //       );

           this.dialogRef.close(pedido);
    //     },
    //     (exception: BadRequestContract) => {
    //       console.log(exception.data)
    //       this.snackbar.open(exception.message, 'ERROR', {
    //         duration: 5000,
    //       });
    //     }
    //   )
    // );
  }

  updatePedido() {
    const pedido: PedidoModel = this.pedidoForm.value;

    this.subscription.add(
      this.pedidoService.update(pedido.id, pedido).subscribe(
        (result) => {
          this.snackbar.open(
            'Pedido ' +
            result.nome +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(pedido);
        },
        (exception: BadRequestContract) => {
          console.log(exception.data)
          this.snackbar.open(exception.message, 'ERROR', {
            duration: 5000,
          });
        }
      )
    );
  }

  deletePedido() {
    const pedido: PedidoModel = this.pedidoForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete pedido ' + pedido.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pedidoService.delete(pedido.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(pedido);
    });
  }

  pictureChange = false;

  updateImage() {
    this.pictureChange = !this.pictureChange;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  get f(): any { return this.pedidoForm.controls; }

  calcularEstoque() {
    const valorCompra = this.f.precoCompra.value;
    const quantidade = this.f.quatidadeEstoque.value;
    const valorVenda = this.f.precoRevenda.value;

    const totalEstoque = valorVenda * quantidade;
    this.pedidoForm.get('precoTotalEstoque')?.setValue(totalEstoque);
  }
}
