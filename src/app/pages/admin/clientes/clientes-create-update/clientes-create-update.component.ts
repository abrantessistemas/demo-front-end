import { Component, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ClienteModel } from '../model/cliente.model';
import { ClienteService } from '../model/cliente.service';

@Component({
  selector: 'abs-clientes-create-update',
  templateUrl: './clientes-create-update.component.html',
  styleUrls: ['./clientes-create-update.component.scss']
})
export class ClientesCreateUpdateComponent {
  clienteForm!: FormGroup;
  formatPhone!: string;
  confirm!: FormControl;

  mode: 'delete' | 'create' | 'update' = 'create';
  listTitle = ['mr', 'ms', 'mrs', 'miss', 'dr'];
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: ClienteModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientesCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private clienteService: ClienteService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as ClienteModel;
    }

    this.clienteForm = this.fb.group({
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
      this.createCliente();
    } else if (this.mode === 'update') {
      this.updateCliente();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createCliente() {
    const cliente = this.clienteForm.value;

    this.subscription.add(
      this.clienteService.create(cliente).subscribe(
        (result) => {
          this.snackbar.open(
            'Cliente ' +
            result.nomeFantasia +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(cliente);
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

  updateCliente() {
    const cliente: ClienteModel = this.clienteForm.value;

    this.subscription.add(
      this.clienteService.update(cliente.id, cliente).subscribe(
        (result) => {
          this.snackbar.open(
            'Cliente ' +
            result.nomeFantasia +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(cliente);
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

  deleteCliente() {
    const cliente: ClienteModel = this.clienteForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete cliente ' + cliente.nomeFantasia + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.delete(cliente.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(cliente);
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
