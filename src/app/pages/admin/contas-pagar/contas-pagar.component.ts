import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ContaPagarModel } from './model/conta-pagar.model';
import { ContaPagarService } from './model/conta-pagar.service';
import { ContasPagarCreateUpdateComponent } from './contas-pagar-create-update/contas-pagar-create-update.component';
import { UtilService } from 'src/app/services/util.service';
import { DemoDataService } from 'src/app/services/demo-data.service';

@Component({
  selector: 'abs-contas-pagar',
  templateUrl: './contas-pagar.component.html',
  styleUrls: ['./contas-pagar.component.scss']
})
export class ContasPagarComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] =
    [
      'id',
      'dataCriacao',
      'criadoPor',
      'ativo',
      'nome', 'actions'
    ];

  dataSource!: any | null;
  clickedRows = new Set<ContaPagarModel>();

  private subscription: Subscription = new Subscription();
  contasPagar!: ContaPagarModel[];
  selection = new SelectionModel<ContaPagarModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private contaPagarService: ContaPagarService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private data: DemoDataService, private util: UtilService
  ) { }

  findAllContasPagar(page: number, limit: number) {
    this.subscription.add(this.contaPagarService.findAll().subscribe(result => {
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
      this.dataSource = this.data.contasPagar;
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

    this.findAllContasPagar(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createContaPagar() {
    this.dialog
      .open(ContasPagarCreateUpdateComponent)
      .afterClosed()
      .subscribe((contaPagar: ContaPagarModel) => {
        if (contaPagar) {
          this.findAllContasPagar(this.pageIndex, this.limit);
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

  updateContaPagar(contaPagar: ContaPagarModel) {
    if (this.util.modoOperacional === 'demo') {
      this.dialog
        .open(ContasPagarCreateUpdateComponent, {
          data: contaPagar,
        })
        .afterClosed().subscribe((pedido) => {

        })
    } else {
      this.contaPagarService.findById(contaPagar.id).subscribe(contaPagarById => {
        this.dialog
          .open(ContasPagarCreateUpdateComponent, {
            data: contaPagarById,
          })
          .afterClosed()
          .subscribe((contaPagar) => {
            if (contaPagar) {
              this.findAllContasPagar(this.pageIndex, this.limit);
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

  deleteContaPagar(contaPagar: ContaPagarModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaPagarService.delete(contaPagar.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllContasPagar(this.pageIndex, this.limit);
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
