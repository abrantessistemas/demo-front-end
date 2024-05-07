import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EnderecoModel } from '../model/endereco.model';
import { EnderecoService } from './../model/endereco.service';

@Component({
  selector: 'abs-enderecos-create-update',
  templateUrl: './enderecos-create-update.component.html',
  styleUrls: ['./enderecos-create-update.component.scss']
})
export class EnderecosCreateUpdateComponent {
  enderecoForm!: FormGroup;
  formatPhone!: string;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';
  listTitle = ['mr', 'ms', 'mrs', 'miss', 'dr'];
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: EnderecoModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<EnderecosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private enderecoService: EnderecoService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as EnderecoModel;
    }

    this.enderecoForm = this.fb.group({
      id: this.defaults.id || '',
      dataCriacao: this.defaults.dataCriacao,
      criadoPor: this.defaults.criadoPor,
      ativo: this.defaults.ativo,
      logradouro: this.defaults.logradouro,
      complemento: this.defaults.complemento,
      numero: this.defaults.numero,
      bairro: this.defaults.bairro,
      municipio: this.defaults.municipio,
      uf: this.defaults.uf,
      cep: this.defaults.cep
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createEndereco();
    } else if (this.mode === 'update') {
      this.updateEndereco();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createEndereco() {
    const endereco = this.enderecoForm.value;

    this.subscription.add(
      this.enderecoService.create(endereco).subscribe(
        (result) => {
          this.snackbar.open(
            'Endereco ' +
            result.cep +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(endereco);
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

  updateEndereco() {
    const endereco: EnderecoModel = this.enderecoForm.value;

    this.subscription.add(
      this.enderecoService.update(endereco.id, endereco).subscribe(
        (result) => {
          this.snackbar.open(
            'Endereco ' +
            result.cep +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(endereco);
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

  deleteEndereco() {
    const endereco: EnderecoModel = this.enderecoForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete endereco ' + endereco.cep + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.enderecoService.delete(endereco.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(endereco);
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
