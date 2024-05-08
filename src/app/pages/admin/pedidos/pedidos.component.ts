import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { PedidosCreateUpdateComponent } from './pedidos-create-update/pedidos-create-update.component';
import { PedidoModel } from './model/pedido.model';
import { PedidoService } from './model/pedido.service';

@Component({
  selector: 'abs-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    'id',
    'dataCriacao',
    'criadoPor',
    'ativo',
    'cliente',
    'itens',
    'dataPedido',
    'status',
    'actions'];

  dataSource!: any | null;
  clickedRows = new Set<PedidoModel>();

  private subscription: Subscription = new Subscription();
  pedidos!: PedidoModel[];
  selection = new SelectionModel<PedidoModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private pedidoService: PedidoService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  findAllPedidos(page: number, limit: number) {
    this.subscription.add(this.pedidoService.findAll().subscribe(result => {
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

  onSearch(page: number, limit: number) {
    localStorage.setItem('paginaAtual', page.toString());
    localStorage.setItem('tamanhoPagina', limit.toString());

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: page, page_size: limit },
      queryParamsHandling: 'merge'
    });

    this.findAllPedidos(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createPedido() {
    this.dialog
      .open(PedidosCreateUpdateComponent)
      .afterClosed()
      .subscribe((pedido: PedidoModel) => {
        if (pedido) {
          this.findAllPedidos(this.pageIndex, this.limit);
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

  updatePedido(pedido: PedidoModel) {
    this.pedidoService.findById(pedido.id).subscribe(pedidoById => {
      this.dialog
        .open(PedidosCreateUpdateComponent, {
          data: pedidoById,
        })
        .afterClosed()
        .subscribe((pedido) => {
          if (pedido) {
            this.findAllPedidos(this.pageIndex, this.limit);
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

  deletePedido(pedido: PedidoModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pedidoService.delete(pedido.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllPedidos(this.pageIndex, this.limit);
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
