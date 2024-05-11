import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ProdutoModel } from '../model/produto.model';
import { ProdutoService } from './../model/produto.service';
import { EstoqueModel } from '../../estoques/model/estoque.model';
import { DemoDataService } from 'src/app/services/demo-data.service';
import { UtilService } from 'src/app/services/util.service';
import { CategoriaModel } from '../../categorias/model/categoria.model';

@Component({
  selector: 'abs-produtos-create-update',
  templateUrl: './produtos-create-update.component.html',
  styleUrls: ['./produtos-create-update.component.scss']
})
export class ProdutosCreateUpdateComponent {
  produtoForm!: FormGroup;
  estoques!: EstoqueModel[];
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';
  categorias!: CategoriaModel[];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: ProdutoModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProdutosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private produtoService: ProdutoService, private data: DemoDataService, private util: UtilService) { }

  ngOnInit() {
    if (this.util.modoOperacional === 'demo') {
      this.categorias = this.data.categorias;
      this.estoques = this.data.estoques;
    }

    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as ProdutoModel;
    }

    this.produtoForm = this.fb.group({
      id: this.defaults.id || '',
      nome: this.defaults.nome,
      descricao: this.defaults.descricao,
      precoCompra: this.defaults.precoCompra,
      precoRevenda: this.defaults.precoRevenda,
      precoTotalEstoque: this.defaults.precoTotalEstoque,
      quatidadeEstoque: this.defaults.quatidadeEstoque,
      codigoBarras: this.defaults.codigoBarras,
      sku: this.defaults.sku,
      imageUrl: this.defaults.imageUrl,
      estoque: this.defaults.estoque,
      categorias: this.defaults.categoria,
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createProduto();
    } else if (this.mode === 'update') {
      this.updateProduto();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createProduto() {
    const produto = this.produtoForm.value;
    this.data.addProduct(produto);
    this.subscription.add(
      this.produtoService.create(produto).subscribe(
        (result) => {
          this.snackbar.open(
            'Produto ' +
            result.nome +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(produto);
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

  updateProduto() {
    const produto: ProdutoModel = this.produtoForm.value;

    this.subscription.add(
      this.produtoService.update(produto.id, produto).subscribe(
        (result) => {
          this.snackbar.open(
            'Produto ' +
            result.nome +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(produto);
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

  deleteProduto() {
    const produto: ProdutoModel = this.produtoForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete produto ' + produto.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.produtoService.delete(produto.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(produto);
    });
  }

  pictureChange = false;

  updateImage() {
    this.pictureChange = !this.pictureChange;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  get f(): any { return this.produtoForm.controls; }

  calcularEstoque() {
    const valorCompra = this.f.precoCompra.value;
    const quantidade = this.f.quatidadeEstoque.value;
    const valorVenda = this.f.precoRevenda.value;

    const totalEstoque = valorVenda * quantidade;
    this.produtoForm.get('precoTotalEstoque')?.setValue(totalEstoque);
  }
}
