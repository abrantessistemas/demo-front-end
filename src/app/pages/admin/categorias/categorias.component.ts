import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { CategoriaModel } from './model/categoria.model';
import { CategoriaService } from './model/categoria.service';
import { CategoriasCreateUpdateComponent } from './categorias-create-update/categorias-create-update.component';

@Component({
  selector: 'abs-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.scss']
})
export class CategoriasComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = ['id', 'nome', 'actions'];
  dataSource!: any | null;
  clickedRows = new Set<CategoriaModel>();

  private subscription: Subscription = new Subscription();
  categorias!: CategoriaModel[];
  selection = new SelectionModel<CategoriaModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private categoriaService: CategoriaService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  findAllCategorias(page: number, limit: number) {
    this.subscription.add(this.categoriaService.findAll().subscribe((result: { total: number; }) => {
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

    this.findAllCategorias(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createCategoria() {
    this.dialog
      .open(CategoriasCreateUpdateComponent)
      .afterClosed()
      .subscribe((categoria: CategoriaModel) => {
        if (categoria) {
          this.findAllCategorias(this.pageIndex, this.limit);
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

  updateCategoria(categoria: CategoriaModel) {
    this.categoriaService.findById(categoria.id).subscribe((categoriaById: any) => {
      this.dialog
        .open(CategoriasCreateUpdateComponent, {
          data: categoriaById,
        })
        .afterClosed()
        .subscribe((categoria) => {
          if (categoria) {
            this.findAllCategorias(this.pageIndex, this.limit);
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

  deleteCategoria(categoria: CategoriaModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoriaService.delete(categoria.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllCategorias(this.pageIndex, this.limit);
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
