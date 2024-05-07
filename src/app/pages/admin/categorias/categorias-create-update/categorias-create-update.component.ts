import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { CategoriaModel } from '../model/categoria.model';
import { CategoriaService } from './../model/categoria.service';

@Component({
  selector: 'abs-categorias-create-update',
  templateUrl: './categorias-create-update.component.html',
  styleUrls: ['./categorias-create-update.component.scss']
})
export class CategoriasCreateUpdateComponent {
  categoriaForm!: FormGroup;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: CategoriaModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoriasCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private categoriaService: CategoriaService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as CategoriaModel;
    }

    this.categoriaForm = this.fb.group({
      id: this.defaults.id || '',
      nome: this.defaults.nome || '',
      descricao: this.defaults.descricao || ''
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createCategoria();
    } else if (this.mode === 'update') {
      this.updateCategoria();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createCategoria() {
    const categoria = this.categoriaForm.value;

    this.subscription.add(
      this.categoriaService.create(categoria).subscribe(
        (result) => {
          this.snackbar.open(
            'Categoria ' +
            result.nome +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(categoria);
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

  updateCategoria() {
    const categoria: CategoriaModel = this.categoriaForm.value;

    this.subscription.add(
      this.categoriaService.update(categoria.id, categoria).subscribe(
        (result) => {
          this.snackbar.open(
            'Categoria ' +
            result.nome +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(categoria);
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

  deleteCategoria() {
    const categoria: CategoriaModel = this.categoriaForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete categoria ' + categoria.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.delete(categoria.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(categoria);
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
