import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { ProdutoModel } from './model/produto.model';
import { ProdutoService } from './model/produto.service';
import { ProdutosCreateUpdateComponent } from './produtos-create-update/produtos-create-update.component';
import { UtilService } from 'src/app/services/util.service';
import { DemoDataService } from 'src/app/services/demo-data.service';

@Component({
  selector: 'abs-produtos',
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.scss']
})
export class ProdutosComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    'id',
    'ativo',
    'nome',
    'descricao',
    'precoCompra',
    'precoRevenda',
    'precoTotalEstoque',
    'quatidadeEstoque',
    'codigoBarras',
    'sku',
    'imageUrl',
    'categoria',
    'actions'];
  dataSource!: any | null;
  clickedRows = new Set<ProdutoModel>();

  private subscription: Subscription = new Subscription();
  produtos!: ProdutoModel[];
  selection = new SelectionModel<ProdutoModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private produtoService: ProdutoService, private dialog: MatDialog, private snackbar: MatSnackBar
    , private data: DemoDataService, private util: UtilService
  ) { }

  findAllProdutos(page: number, limit: number) {
    this.subscription.add(this.produtoService.findAll().subscribe(result => {
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
      this.dataSource = this.data.produtos;
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

    this.findAllProdutos(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createProduto() {
    this.dialog
      .open(ProdutosCreateUpdateComponent)
      .afterClosed()
      .subscribe((produto: ProdutoModel) => {
        if (produto) {
          this.findAllProdutos(this.pageIndex, this.limit);
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

  updateProduto(produto: ProdutoModel) {
    if (this.util.modoOperacional === 'demo') {
      this.dialog
        .open(ProdutosCreateUpdateComponent, {
          data: produto,
        })
        .afterClosed().subscribe((produto) => {

        })
    } else {
      this.produtoService.findById(produto.id).subscribe(produtoById => {
        this.dialog
          .open(ProdutosCreateUpdateComponent, {
            data: produtoById,
          })
          .afterClosed()
          .subscribe((produto) => {
            if (produto) {
              this.findAllProdutos(this.pageIndex, this.limit);
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

  deleteProduto(produto: ProdutoModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.produtoService.delete(produto.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllProdutos(this.pageIndex, this.limit);
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
