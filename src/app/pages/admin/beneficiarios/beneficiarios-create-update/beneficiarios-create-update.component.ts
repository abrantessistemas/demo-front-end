import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { BeneficiarioModel } from '../model/beneficiario.model';
import { BeneficiarioService } from '../model/beneficiario.service';

@Component({
  selector: 'abs-beneficiarios-create-update',
  templateUrl: './beneficiarios-create-update.component.html',
  styleUrls: ['./beneficiarios-create-update.component.scss']
})
export class BeneficiariosCreateUpdateComponent {
  beneficiarioForm!: FormGroup;
  formatPhone!: string;

  mode: 'delete' | 'create' | 'update' = 'create';
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: BeneficiarioModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<BeneficiariosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private beneficiarioService: BeneficiarioService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as BeneficiarioModel;
    }

    this.beneficiarioForm = this.fb.group({
      id: this.defaults.id,
      nome: this.defaults.nome,
      telefone: this.defaults.telefone,
      dataNascimento: this.defaults.dataNascimento,
      dataInclusao: this.defaults.dataInclusao,
      dataAtualizacao: this.defaults.dataAtualizacao
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createBeneficiario();
    } else if (this.mode === 'update') {
      this.updateBeneficiario();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createBeneficiario() {
    const beneficiario = this.beneficiarioForm.value;

    this.subscription.add(
      this.beneficiarioService.create(beneficiario).subscribe(
        (result) => {
          this.snackbar.open(
            'Beneficiário ' +
            result.nome +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(beneficiario);
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

  updateBeneficiario() {
    const beneficiario: BeneficiarioModel = this.beneficiarioForm.value;

    this.subscription.add(
      this.beneficiarioService.update(beneficiario.id, beneficiario).subscribe(
        (result) => {
          this.snackbar.open(
            'Beneficiário ' +
            result.nome +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(beneficiario);
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

  deleteBeneficiario() {
    const beneficiario: BeneficiarioModel = this.beneficiarioForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete beneficiario ' + beneficiario.nome + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficiarioService.delete(beneficiario.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(beneficiario);
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
