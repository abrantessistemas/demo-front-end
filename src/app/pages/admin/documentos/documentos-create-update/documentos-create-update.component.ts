import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { DocumentoModel } from '../model/documento.model';
import { DocumentoService } from '../model/documento.service';

@Component({
  selector: 'abs-documentos-create-update',
  templateUrl: './documentos-create-update.component.html',
  styleUrls: ['./documentos-create-update.component.scss']
})
export class DocumentosCreateUpdateComponent {
  documentoForm!: FormGroup;
  formatPhone!: string;

  mode: 'delete' | 'create' | 'update' = 'create';
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: DocumentoModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<DocumentosCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private documentoService: DocumentoService) { }

  ngOnInit() {
    if (this.defaults.id) {
      this.mode = 'update';
    }

    this.documentoForm = this.fb.group({
      id: this.defaults.id,
      descricao: this.defaults.descricao,
      tipoDocumento: this.defaults.tipoDocumento,
      beneficiario: this.defaults.beneficiario
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createDocumento();
    } else if (this.mode === 'update') {
      this.updateDocumento();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createDocumento() {
    const documento = this.documentoForm.value;
      this.subscription.add(
        this.documentoService.create(documento).subscribe(
          (result) => {
            this.snackbar.open(
              'Documento ' +
              result.descricao +
              ' successfully created.',
              'OK',
              {
                duration: 5000,
              }
            );

            this.dialogRef.close(documento);
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

  updateDocumento() {
    const documento: DocumentoModel = this.documentoForm.value;

    this.subscription.add(
      this.documentoService.update(documento.id, documento).subscribe(
        (result) => {
          this.snackbar.open(
            'Documento ' +
            result.descricao +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(documento);
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

  deleteDocumento() {
    const documento: DocumentoModel = this.documentoForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete documento ' + documento.descricao + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentoService.delete(documento.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(documento);
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
