import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ContaReceberModel } from './model/conta-receber.model';
import { ContaReceberService } from './model/conta-receber.service';
import { ContasReceberCreateUpdateComponent } from './contas-receber-create-update/contas-receber-create-update.component';
import { UtilService } from 'src/app/services/util.service';
import { DemoDataService } from 'src/app/services/demo-data.service';

@Component({
  selector: 'abs-contas-receber',
  templateUrl: './contas-receber.component.html',
  styleUrls: ['./contas-receber.component.scss']
})
export class ContasReceberComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] =
    [
      'id',
      'ativo',
      'descricao',
      'valor',
      'dataRecebimento',
      'actions'
    ];

  dataSource!: any | null;
  clickedRows = new Set<ContaReceberModel>();

  private subscription: Subscription = new Subscription();
  contasReceber!: ContaReceberModel[];
  selection = new SelectionModel<ContaReceberModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private contaReceberService: ContaReceberService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private data: DemoDataService, private util: UtilService
  ) { }

  findAllContasReceber(page: number, limit: number) {
    this.subscription.add(this.contaReceberService.findAll().subscribe(result => {
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
      this.dataSource = this.data.contasReceber;
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

    this.findAllContasReceber(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createContaReceber() {
    this.dialog
      .open(ContasReceberCreateUpdateComponent)
      .afterClosed()
      .subscribe((contaReceber: ContaReceberModel) => {
        if (contaReceber) {
          this.findAllContasReceber(this.pageIndex, this.limit);
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

  updateContaReceber(contaReceber: ContaReceberModel) {
    if (this.util.modoOperacional === 'demo') {
      this.dialog
        .open(ContasReceberCreateUpdateComponent, {
          data: contaReceber,
        })
        .afterClosed().subscribe((pedido) => {

        })
    } else {
      this.contaReceberService.findById(contaReceber.id).subscribe(contaReceberById => {
        this.dialog
          .open(ContasReceberCreateUpdateComponent, {
            data: contaReceberById,
          })
          .afterClosed()
          .subscribe((contaReceber) => {
            if (contaReceber) {
              this.findAllContasReceber(this.pageIndex, this.limit);
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

  deleteContaReceber(contaReceber: ContaReceberModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.contaReceberService.delete(contaReceber.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllContasReceber(this.pageIndex, this.limit);
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
