import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { EmpresaModel } from './model/empresa.model';
import { EmpresaService } from './model/empresa.service';
import { EmpresasCreateUpdateComponent } from './empresas-create-update/empresas-create-update.component';
import { UtilService } from 'src/app/services/util.service';
import { DemoDataService } from 'src/app/services/demo-data.service';

@Component({
  selector: 'abs-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss']
})
export class EmpresasComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    'id',
    'dataCriacao',
    'criadoPor',
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
  clickedRows = new Set<EmpresaModel>();

  private subscription: Subscription = new Subscription();
  empresas!: EmpresaModel[];
  selection = new SelectionModel<EmpresaModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private empresaService: EmpresaService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private data: DemoDataService, private util: UtilService
  ) { }

  findAllEmpresas(page: number, limit: number) {
    this.subscription.add(this.empresaService.findAll().subscribe(result => {
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
      this.dataSource = this.data.empresa;
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

    this.findAllEmpresas(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createEmpresa() {
    this.dialog
      .open(EmpresasCreateUpdateComponent)
      .afterClosed()
      .subscribe((empresa: EmpresaModel) => {
        if (empresa) {
          this.findAllEmpresas(this.pageIndex, this.limit);
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

  updateEmpresa(empresa: EmpresaModel) {
    if (this.util.modoOperacional === 'demo') {
      this.dialog
        .open(EmpresasCreateUpdateComponent, {
          data: empresa,
        })
        .afterClosed().subscribe((empresa) => {

        })
    } else {
      this.empresaService.findById(empresa.id).subscribe(empresaById => {

      this.dialog
        .open(EmpresasCreateUpdateComponent, {
          data: empresaById,
        })
        .afterClosed()
        .subscribe((empresa) => {
          if (empresa) {
            this.findAllEmpresas(this.pageIndex, this.limit);
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

  deleteEmpresa(empresa: EmpresaModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaService.delete(empresa.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllEmpresas(this.pageIndex, this.limit);
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
