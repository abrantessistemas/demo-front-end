import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EstoqueModel } from './model/estoque.model';
import { EstoqueService } from './model/estoque.service';
import { EstoquesCreateUpdateComponent } from './estoques-create-update/estoques-create-update.component';

@Component({
  selector: 'abs-estoques',
  templateUrl: './estoques.component.html',
  styleUrls: ['./estoques.component.scss']
})
export class EstoquesComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = ['id',
    'nome',
    'descricao',
    'preco',
    'quantidade', 'actions'];
  dataSource!: any | null;
  clickedRows = new Set<EstoqueModel>();

  private subscription: Subscription = new Subscription();
  estoques!: EstoqueModel[];
  selection = new SelectionModel<EstoqueModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private estoqueService: EstoqueService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  findAllEstoques(page: number, limit: number) {
    this.subscription.add(this.estoqueService.findAll().subscribe(result => {
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

    this.findAllEstoques(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createEstoque() {
    this.dialog
      .open(EstoquesCreateUpdateComponent)
      .afterClosed()
      .subscribe((estoque: EstoqueModel) => {
        if (estoque) {
          this.findAllEstoques(this.pageIndex, this.limit);
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

  updateEstoque(estoque: EstoqueModel) {
    this.estoqueService.findById(estoque.id).subscribe(estoqueById => {
      this.dialog
        .open(EstoquesCreateUpdateComponent, {
          data: estoqueById,
        })
        .afterClosed()
        .subscribe((estoque) => {
          if (estoque) {
            this.findAllEstoques(this.pageIndex, this.limit);
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

  deleteEstoque(estoque: EstoqueModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.estoqueService.delete(estoque.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllEstoques(this.pageIndex, this.limit);
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
