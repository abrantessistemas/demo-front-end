import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ContaPagarModel } from '../model/conta-pagar.model';
import { ContaPagarService } from './../model/conta-pagar.service';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'DDD MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'DDDD MMMM YYYY',
  },
};

@Component({
  selector: 'abs-contas-pagar-create-update',
  templateUrl: './contas-pagar-create-update.component.html',
  styleUrls: ['./contas-pagar-create-update.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
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
      descricao: this.defaults.descricao || '',
      valor: this.defaults.valor || '',
      dataVencimento: new Date(this.defaults.dataVencimento) || ''
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
          this.snackbar.open('ContaPagar ' + result.descricao + ' criado com sucesso.',
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
          this.snackbar.open('ContaPagar ' + result.descricao + ' atualizado com sucesso.',
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
        message: 'Tem certeza que deseja deletar o registro de ContaPagar ' + contaPagar.descricao + '?'
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
