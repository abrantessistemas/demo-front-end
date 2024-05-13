import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ContaPagarModel } from '../model/conta-pagar.model';
import { ContaPagarService } from './../model/conta-pagar.service';

@Component({
  selector: 'abs-contas-pagar-create-update',
  templateUrl: './contas-pagar-create-update.component.html',
  styleUrls: ['./contas-pagar-create-update.component.scss']
})
export class ContasPagarCreateUpdateComponent {
  contaPagarForm!: FormGroup;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: ContaPagarModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContasPagarCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private contaPagarService: ContaPagarService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as ContaPagarModel;
    }

    this.contaPagarForm = this.fb.group({
      id: this.defaults.id || '',
      dataCriacao: this.defaults.dataCriacao || '',
      criadoPor: this.defaults.criadoPor || '',
      ativo: this.defaults.ativo || '',
      nome: this.defaults.nome || ''
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createContaPagar();
    } else if (this.mode === 'update') {
      this.updateContaPagar();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createContaPagar() {
    const contaPagar = this.contaPagarForm.value;

    this.subscription.add(
      this.contaPagarService.create(contaPagar).subscribe(
        (result) => {
          this.snackbar.open('ContaPagar ' + result.nome + ' criado com sucesso.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(contaPagar);
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

  updateContaPagar() {
    const contaPagar: ContaPagarModel = this.contaPagarForm.value;

    this.subscription.add(
      this.contaPagarService.update(contaPagar.id, contaPagar).subscribe(
        (result) => {
          this.snackbar.open('ContaPagar ' + result.nome + ' atualizado com sucesso.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(contaPagar);
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

  deleteContaPagar() {
    const contaPagar: ContaPagarModel = this.contaPagarForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza que deseja deletar o registro de ContaPagar ' + contaPagar.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaPagarService.delete(contaPagar.id).subscribe(() => {
          this.snackbar.open('Item deletado com sucesso.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(contaPagar);
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
