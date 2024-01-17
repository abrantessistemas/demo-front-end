import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { BeneficiariosCreateUpdateComponent } from './beneficiarios-create-update/beneficiarios-create-update.component';
import { BeneficiarioModel } from './model/beneficiario.model';
import { BeneficiarioService } from './model/beneficiario.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'abs-beneficiarios',
  templateUrl: './beneficiarios.component.html',
  styleUrls: ['./beneficiarios.component.scss']
})
export class BeneficiariosComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = [
    'id',
    'nome',
    'telefone',
    'dataNascimento',
    'dataInclusao',
    'dataAtualizacao',
    'actions'];

  dataSource!: any | null;
  clickedRows = new Set<BeneficiarioModel>();

  private subscription: Subscription = new Subscription();
  beneficiarios!: BeneficiarioModel[];
  selection = new SelectionModel<BeneficiarioModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private beneficiarioService: BeneficiarioService, private dialog: MatDialog, private snackbar: MatSnackBar,
    private datePipe: DatePipe) { }

  findAllBeneficiarios(page: number, limit: number) {
    this.subscription.add(this.beneficiarioService.findAll().subscribe(result => {
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

    this.findAllBeneficiarios(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createBeneficiario() {
    this.dialog
      .open(BeneficiariosCreateUpdateComponent)
      .afterClosed()
      .subscribe((beneficiario: BeneficiarioModel) => {
        if (beneficiario) {
          this.findAllBeneficiarios(this.pageIndex, this.limit);
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

  updateBeneficiario(beneficiario: BeneficiarioModel) {
    this.beneficiarioService.findById(beneficiario.id).subscribe(beneficiarioById => {
      this.dialog
        .open(BeneficiariosCreateUpdateComponent, {
          data: beneficiarioById,
        })
        .afterClosed()
        .subscribe((beneficiario) => {
          if (beneficiario) {
            this.findAllBeneficiarios(this.pageIndex, this.limit);
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

  deleteBeneficiario(beneficiario: BeneficiarioModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.beneficiarioService.delete(beneficiario.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllBeneficiarios(this.pageIndex, this.limit);
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
