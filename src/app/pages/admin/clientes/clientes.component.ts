import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ClientesCreateUpdateComponent } from './clientes-create-update/clientes-create-update.component';
import { ClienteModel } from './model/cliente.model';
import { ClienteService } from './model/cliente.service';
import { UtilService } from 'src/app/services/util.service';
import { DemoDataService } from 'src/app/services/demo-data.service';

@Component({
  selector: 'abs-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.scss']
})
export class ClientesComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    'id',
    'ativo',
    'nomeFantasia',
    'razaoSocial',
    'inscricaoEstadual',
    'inscricaoMunicipal',
    'cnpj',
    'cpf',
    'telefone',
    'email',
    'responsavel',
    'actions'];
  dataSource!: any | null;
  clickedRows = new Set<ClienteModel>();

  private subscription: Subscription = new Subscription();
  clientes!: ClienteModel[];
  selection = new SelectionModel<ClienteModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private clienteService: ClienteService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private data: DemoDataService, private util: UtilService
  ) { }

  findAllClientes(page: number, limit: number) {
    this.subscription.add(this.clienteService.findAll().subscribe(result => {
      this.totalItems = result.total;
      this.dataSource = result;
    },
      (exception: BadRequestContract) => {
        console.log(exception)
        this.snackbar.open(exception.message, exception.status.toString(), {
          duration: 5000,
          panelClass: 'app-notification-error'
        });
      }));
  }

  ngOnInit() {
    if (this.util.modoOperacional === 'demo') {
      this.dataSource = this.data.clientes;
    } else {
      const paginaAtual = localStorage.getItem('paginaAtual');
      const tamanhoPagina = localStorage.getItem('tamanhoPagina') || 5;

      if (paginaAtual && tamanhoPagina) {
        this.limit = +tamanhoPagina;
        this.pageIndex = +paginaAtual;

        this.onSearch(this.pageIndex, this.limit);
      } else {
        this.onSearch(1, this.limit);
      }
    }
  }

  onSearch(page: number, limit: number) {
    localStorage.setItem('paginaAtual', page.toString());
    localStorage.setItem('tamanhoPagina', limit.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page, page_size: limit },
      queryParamsHandling: 'merge'
    });

    this.findAllClientes(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createCliente() {
    this.dialog
      .open(ClientesCreateUpdateComponent)
      .afterClosed()
      .subscribe((cliente: ClienteModel) => {
        if (cliente) {
          this.findAllClientes(this.pageIndex, this.limit);
          this.snackbar.open('Cadastro realizado com sucesso.', 'OK', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        }
      },
        (exception: BadRequestContract) => {
          this.snackbar.open(exception.message, exception.status.toString(), {
            duration: 5000,
            panelClass: 'app-notification-error'
          });
        });
  }

  updateCliente(cliente: ClienteModel) {
    if (this.util.modoOperacional === 'demo') {
      this.dialog
        .open(ClientesCreateUpdateComponent, {
          data: cliente,
        })
        .afterClosed().subscribe((cliente) => {

        })
    } else {
      this.clienteService.findById(cliente.id).subscribe(clienteById => {

      this.dialog
        .open(ClientesCreateUpdateComponent, {
          data: clienteById,
        })
        .afterClosed()
        .subscribe((cliente) => {
          if (cliente) {
            this.findAllClientes(this.pageIndex, this.limit);
            this.snackbar.open('Registro atualizado com sucesso.', 'OK', {
              duration: 5000,
              panelClass: 'app-notification-success'
            });
          }
        },
          (exception: BadRequestContract) => {
            this.snackbar.open(exception.message, exception.status.toString(), {
              duration: 5000,
              panelClass: 'app-notification-error'
            });
          });

    });
  }
  }

  deleteCliente(cliente: ClienteModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clienteService.delete(cliente.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllClientes(this.pageIndex, this.limit);
    },
      (exception: BadRequestContract) => {
        this.snackbar.open(exception.message, exception.status.toString(), {
          duration: 5000,
          panelClass: 'app-notification-error'
        });
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
