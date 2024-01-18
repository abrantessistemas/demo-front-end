import { SelectionModel } from '@angular/cdk/collections';
import { DatePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { DocumentosCreateUpdateComponent } from './documentos-create-update/documentos-create-update.component';
import { DocumentoModel } from './model/documento.model';
import { DocumentoService } from './model/documento.service';

@Component({
  selector: 'abs-documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ['./documentos.component.scss']
})
export class DocumentosComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];
  @Input() exibirTitulo: boolean = false;
  @Input() beneficiarioId!: any;

  displayedColumns: string[] = [
    'id',
    'descricao',
    'tipoDocumento',
    'dataInclusao',
    'dataAtualizacao',
    'actions'];

  dataSource!: any | null;
  clickedRows = new Set<DocumentoModel>();

  private subscription: Subscription = new Subscription();
  documentos!: DocumentoModel[];
  selection = new SelectionModel<DocumentoModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private documentoService: DocumentoService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private datePipe: DatePipe) { }

  findAllDocumentos(page: number, limit: number) {
    this.subscription.add(this.documentoService.findAll().subscribe(result => {
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

  findAllDocumentosByBeneficiario(page: number, limit: number) {
    this.subscription.add(this.documentoService.findAllByBeneficiario(this.beneficiarioId).subscribe(result => {
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

    if (this.beneficiarioId) {
      this.findAllDocumentosByBeneficiario(page, limit);
    } else {
      this.findAllDocumentos(page, limit);

    }
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createDocumento() {
    const documento = new DocumentoModel;
    documento.beneficiario = this.beneficiarioId;

    this.dialog
      .open(DocumentosCreateUpdateComponent, { data: documento })
      .afterClosed()
      .subscribe((documento: DocumentoModel) => {
        if (documento) {
          if (this.beneficiarioId) {
            this.findAllDocumentosByBeneficiario(this.pageIndex, this.limit);
          } else {
            this.findAllDocumentos(this.pageIndex, this.limit);

          }
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

  updateDocumento(documento: DocumentoModel) {
    this.documentoService.findById(documento.id).subscribe(documentoById => {
      this.dialog
        .open(DocumentosCreateUpdateComponent, {
          data: documentoById,
        })
        .afterClosed()
        .subscribe((documento) => {
          if (documento) {
            this.findAllDocumentos(this.pageIndex, this.limit);
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

  deleteDocumento(documento: DocumentoModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.documentoService.delete(documento.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllDocumentos(this.pageIndex, this.limit);
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

  formatDate(date: any): string {
    if (date) {
      return this.datePipe.transform(date, 'dd/MM/yyyy') || '';
    }
    return '';
  }

}
