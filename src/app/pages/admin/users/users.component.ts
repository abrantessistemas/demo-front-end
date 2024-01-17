import { SelectionModel } from '@angular/cdk/collections';
import { Component } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from './model/user.model';
import { UserService } from './model/user.service';
import { UsersCreateUpdateComponent } from './users-create-update/users-create-update.component';

@Component({
  selector: 'abs-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  limit!: number;
  totalItems!: number;
  pageSizeOptions: number[] = [5, 10, 20];

  displayedColumns: string[] = ['id', 'username', 'role', 'actions'];
  dataSource!: any | null;
  clickedRows = new Set<UserModel>();

  private subscription: Subscription = new Subscription();
  users!: UserModel[];
  selection = new SelectionModel<UserModel>(true, []);
  pageIndex!: number;
  route: ActivatedRoute | null | undefined;

  constructor(private router: Router, private userService: UserService, private dialog: MatDialog, private snackbar: MatSnackBar) { }

  findAllUsers(page: number, limit: number) {
    this.subscription.add(this.userService.findAll().subscribe(result => {
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

    this.findAllUsers(page, limit);
  }


  onPage(pageEvent: PageEvent) {
    const paginaAtual = pageEvent.pageIndex + 1;
    const tamanhoPagina = pageEvent.pageSize;

    this.onSearch(paginaAtual, tamanhoPagina);
  }

  createUser() {
    this.dialog
      .open(UsersCreateUpdateComponent)
      .afterClosed()
      .subscribe((user: UserModel) => {
        if (user) {
          this.findAllUsers(this.pageIndex, this.limit);
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

  updateUser(user: UserModel) {
    this.userService.findById(user.id).subscribe(userById => {
      userById.password = '';
      this.dialog
        .open(UsersCreateUpdateComponent, {
          data: userById,
        })
        .afterClosed()
        .subscribe((user) => {
          if (user) {
            this.findAllUsers(this.pageIndex, this.limit);
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

  deleteUser(user: UserModel) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Tem certeza de que deseja excluir este item?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(user.id).subscribe(() => {
          this.snackbar.open('Registro excluído com sucesso!', 'Fechar', {
            duration: 5000,
            panelClass: 'app-notification-success'
          });
        });
      }
      this.findAllUsers(this.pageIndex, this.limit);
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
