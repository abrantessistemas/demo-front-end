import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Auth2Service } from 'src/app/auth/auth2.service';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';

@Component({
  selector: 'abs-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  register = 'register';

  constructor(private fb: FormBuilder, private authService: Auth2Service,
    private router: Router, private snackbar: MatSnackBar) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  submit() {
    this.router.navigate(['admin/dashboard']);
    /*
    this.authService.login(
      this.form.controls['username'].value,
      this.form.controls['password'].value,
    ).pipe(first()).subscribe(
      (data: any) => {
        const perfil = this.authService.getUserRoles();

        if (perfil.includes('ADMIN')) {
          this.router.navigate(['admin/dashboard']);
        } else {
          this.router.navigate(['user']);
        }
      },
      (exception: BadRequestContract) => {
        this.snackbar.open(exception.message || 'Erro de autenticação', exception.status.toString(), {
          duration: 5000,
          panelClass: 'app-notification-error'
        });
      }
    );
    */
  }
}
