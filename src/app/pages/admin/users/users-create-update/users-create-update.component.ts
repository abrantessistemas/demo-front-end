import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';
import { ConfirmationDialogComponent } from 'src/app/common/dialog/confirmation-dialog/confirmation-dialog.component';
import { UserModel } from '../model/user.model';
import { UserService } from './../model/user.service';

@Component({
  selector: 'abs-users-create-update',
  templateUrl: './users-create-update.component.html',
  styleUrls: ['./users-create-update.component.scss']
})
export class UsersCreateUpdateComponent {
  userForm!: FormGroup;
  formatPhone!: string;

  mode: 'delete' | 'create' | 'update' = 'create';
  listTitle = ['mr', 'ms', 'mrs', 'miss', 'dr'];
  listProfile = ['ADMIN', 'USER'];

  private subscription: Subscription = new Subscription();

  constructor(@Inject(MAT_DIALOG_DATA) public defaults: UserModel, private fb: FormBuilder,
    private dialogRef: MatDialogRef<UsersCreateUpdateComponent>, private dialog: MatDialog,
    private snackbar: MatSnackBar, private userService: UserService) { }

  ngOnInit() {
    if (this.defaults) {
      this.mode = 'update';
    } else {
      this.defaults = {} as UserModel;
    }

    this.userForm = this.fb.group({
      id: this.defaults.id || '',
      username: this.defaults.username || '',
      password: this.defaults.password || '',
      role: this.defaults.role || ''
    });
  }
  save() {
    if (this.mode === 'create') {
      this.createUser();
    } else if (this.mode === 'update') {
      this.updateUser();
    }
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  createUser() {
    const user = this.userForm.value;

    this.subscription.add(
      this.userService.create(user).subscribe(
        (result) => {
          this.snackbar.open(
            'User ' +
            result.username +
            ' successfully created.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(user);
        },
        (exception: BadRequestContract) => {
          console.log(exception.data)
          this.snackbar.open(exception.message, 'ERROR', {
            duration: 5000,
          });
        }
      )
    );
  }

  updateUser() {
    const user: UserModel = this.userForm.value;

    this.subscription.add(
      this.userService.update(user.id, user).subscribe(
        (result) => {
          this.snackbar.open(
            'User ' +
            result.username +
            ' updated successfully.',
            'OK',
            {
              duration: 5000,
            }
          );

          this.dialogRef.close(user);
        },
        (exception: BadRequestContract) => {
          console.log(exception.data)
          this.snackbar.open(exception.message, 'ERROR', {
            duration: 5000,
          });
        }
      )
    );
  }

  deleteUser() {
    const user: UserModel = this.userForm.value;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Are you sure you want to delete user ' + user.username + '?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.delete(user.id).subscribe(() => {
          this.snackbar.open('Item deleted successfully.', 'Close', {
            duration: 5 * 1000,
          });
        });
      }
      this.dialogRef.close(user);
    });
  }

  pictureChange = false;

  updateImage() {
    this.pictureChange = !this.pictureChange;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
