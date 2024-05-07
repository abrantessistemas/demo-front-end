import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EstoqueModel } from '../model/estoque.model';
import { EstoqueService } from './../model/estoque.service';

@Component({
  selector: 'abs-estoques-create-update',
  templateUrl: './estoques-create-update.component.html',
  styleUrls: ['./estoques-create-update.component.scss']
})
export class EstoquesCreateUpdateComponent {
  estoqueForm!: FormGroup;
  formatPhone!: string;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';
  listTitle = ['mr', 'ms', 'mrs', 'miss', 'dr'];
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: EstoqueModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<EstoquesCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private estoqueService: EstoqueService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as EstoqueModel;
    }

    this.estoqueForm = this.fb.group({
      id: this.defaults.id || '',
      nome: this.defaults.nome || '',
      descricao: this.defaults.descricao || '',
      preco: this.defaults.preco || '',
      quantidade: this.defaults.quantidade || '',
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createEstoque();
    } else if (this.mode === 'update') {
      this.updateEstoque();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createEstoque() {
    const estoque = this.estoqueForm.value;

    this.subscription.add(
      this.estoqueService.create(estoque).subscribe(
        (result) => {
          this.snackbar.open(
            'Estoque ' +
            result.nome +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(estoque);
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

  updateEstoque() {
    const estoque: EstoqueModel = this.estoqueForm.value;

    this.subscription.add(
      this.estoqueService.update(estoque.id, estoque).subscribe(
        (result) => {
          this.snackbar.open(
            'Estoque ' +
            result.nome +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(estoque);
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

  deleteEstoque() {
    const estoque: EstoqueModel = this.estoqueForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete estoque ' + estoque.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estoqueService.delete(estoque.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(estoque);
    });
  }

  pictureChange = false;

  updateImage() {
    this.pictureChange = !this.pictureChange;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
