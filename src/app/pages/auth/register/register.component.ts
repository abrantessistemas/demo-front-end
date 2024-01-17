import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { first } from 'rxjs';
import { Auth2Service } from 'src/app/auth/auth2.service';
import { BadRequestContract } from 'src/app/common/bad-request-contract.model';

@Component({
  selector: 'abs-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  public user = {
    login: '',
    password: '',
    role: 'ADMIN',
  }

  constructor(private fb: FormBuilder, private authService: Auth2Service,
    private router: Router, private snackbar: MatSnackBar) {

  }
  ngOnInit(): void {
    this.form = this.fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
    });
  }

  submit() {
    this.user.login = this.form.controls['username'].value
    this.user.password = this.form.controls['password'].value
    this.authService.registerUser(
      this.user
    ).pipe(first()).subscribe((data) => {
      const perfil = data.authorities[0];

      if (perfil === 'ADMIN') {
        this.router.navigate(['admin/dashboard']);
      } else if (perfil === 'MASTER') {
        this.router.navigate(['master/dashboard']);

      } else {
        this.router.navigate(['user']);

      }
      this.snackbar.open('Cadastro realizado com sucesso.', 'fechar', {
        duration: 5000,
        panelClass: 'app-notification-success'
      });
    },
      (exception: BadRequestContract) => {
        this.snackbar.open(exception.message, exception.status.toString(), {
          duration: 5000,
          panelClass: 'app-notification-error'
        });
      });

  }
}
