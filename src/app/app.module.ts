import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { TextFieldModule } from '@angular/cdk/text-field';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationDialogModule } from './common/dialog/confirmation-dialog/confirmation-dialog.module';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { WidgetsModule } from './components/widgets/widgets.module';
import { BeneficiariosModule } from './pages/admin/beneficiarios/beneficiarios.module';
import { CategoriasModule } from './pages/admin/categorias/categorias.module';
import { ClientesModule } from './pages/admin/clientes/clientes.module';
import { ContasPagarModule } from './pages/admin/contas-pagar/contas-pagar.module';
import { ContasReceberModule } from './pages/admin/contas-receber/contas-receber.module';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { DocumentosModule } from './pages/admin/documentos/documentos.module';
import { EmpresasModule } from './pages/admin/empresas/empresas.module';
import { EnderecosModule } from './pages/admin/enderecos/enderecos.module';
import { EstoquesModule } from './pages/admin/estoques/estoques.module';
import { PedidosModule } from './pages/admin/pedidos/pedidos.module';
import { ProdutosModule } from './pages/admin/produtos/produtos.module';
import { UsersModule } from './pages/admin/users/users.module';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    SidenavComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatButtonToggleModule,
    FormsModule,
    //API
    ConfirmationDialogModule,
    UsersModule,
    BeneficiariosModule,
    DocumentosModule,
    ProdutosModule,
    CategoriasModule,
    EmpresasModule,
    EnderecosModule,
    EstoquesModule,
    ClientesModule,
    WidgetsModule,
    PedidosModule,
    ContasReceberModule,
    ContasPagarModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
