import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EmpresaModel } from '../model/empresa.model';
import { EmpresaService } from './../model/empresa.service';

@Component({
  selector: 'abs-empresas-create-update',
  templateUrl: './empresas-create-update.component.html',
  styleUrls: ['./empresas-create-update.component.scss']
})
export class EmpresasCreateUpdateComponent {
  empresaForm!: FormGroup;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: EmpresaModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmpresasCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private empresaService: EmpresaService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as EmpresaModel;
    }

    this.empresaForm = this.fb.group({
      id: this.defaults.id || '',
      dataCriacao: this.defaults.dataCriacao,
      criadoPor: this.defaults.criadoPor,
      ativo: this.defaults.ativo,
      nomeFantasia: this.defaults.nomeFantasia,
      razaoSocial: this.defaults.razaoSocial,
      inscricaoEstadual: this.defaults.inscricaoEstadual,
      inscricaoMunicipal: this.defaults.inscricaoMunicipal,
      cnpj: this.defaults.cnpj,
      cpf: this.defaults.cpf,
      telefone: this.defaults.telefone,
      email: this.defaults.email,
      responsavel: this.defaults.responsavel,
      endereco: this.defaults.endereco
    });

  }
  save() {
    if (this.mode === 'create') {
      this.createEmpresa();
    } else if (this.mode === 'update') {
      this.updateEmpresa();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createEmpresa() {
    const empresa = this.empresaForm.value;

    this.subscription.add(
      this.empresaService.create(empresa).subscribe(
        (result) => {
          this.snackbar.open(
            'Empresa ' +
            result.nomeFantasia +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(empresa);
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

  updateEmpresa() {
    const empresa: EmpresaModel = this.empresaForm.value;

    this.subscription.add(
      this.empresaService.update(empresa.id, empresa).subscribe(
        (result) => {
          this.snackbar.open(
            'Empresa ' +
            result.nomeFantasia +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(empresa);
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

  deleteEmpresa() {
    const empresa: EmpresaModel = this.empresaForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete empresa ' + empresa.nomeFantasia + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaService.delete(empresa.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(empresa);
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
