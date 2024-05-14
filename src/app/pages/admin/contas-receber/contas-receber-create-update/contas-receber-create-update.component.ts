import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ContaReceberModel } from '../model/conta-receber.model';
import { ContaReceberService } from './../model/conta-receber.service';

@Component({
  selector: 'abs-contas-receber-create-update',
  templateUrl: './contas-receber-create-update.component.html',
  styleUrls: ['./contas-receber-create-update.component.scss']
})
export class ContasReceberCreateUpdateComponent {
  contaReceberForm!: FormGroup;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: ContaReceberModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<ContasReceberCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private contaReceberService: ContaReceberService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as ContaReceberModel;
    }

    this.contaReceberForm = this.fb.group({
      id: this.defaults.id || '',
      dataCriacao: this.defaults.dataCriacao || '',
      criadoPor: this.defaults.criadoPor || '',
      ativo: this.defaults.ativo || '',
      descricao: this.defaults.descricao || '',
      valor: this.defaults.valor || '',
      dataRecebimento: new Date(this.defaults.dataRecebimento) || ''
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createContaReceber();
    } else if (this.mode === 'update') {
      this.updateContaReceber();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createContaReceber() {
    const contaReceber = this.contaReceberForm.value;

    this.subscription.add(
      this.contaReceberService.create(contaReceber).subscribe(
        (result) => {
          this.snackbar.open('ContaReceber ' + result.descricao + ' criado com sucesso.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(contaReceber);
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

  updateContaReceber() {
    const contaReceber: ContaReceberModel = this.contaReceberForm.value;

    this.subscription.add(
      this.contaReceberService.update(contaReceber.id, contaReceber).subscribe(
        (result) => {
          this.snackbar.open('ContaReceber ' + result.descricao + ' atualizado com sucesso.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(contaReceber);
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

  deleteContaReceber() {
    const contaReceber: ContaReceberModel = this.contaReceberForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza que deseja deletar o registro de ContaReceber ' + contaReceber.descricao + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaReceberService.delete(contaReceber.id).subscribe(() => {
          this.snackbar.open('Item deletado com sucesso.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(contaReceber);
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
