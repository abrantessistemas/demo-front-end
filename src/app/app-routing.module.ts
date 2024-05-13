import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BeneficiariosComponent } from './pages/admin/beneficiarios/beneficiarios.component';
import { CategoriasComponent } from './pages/admin/categorias/categorias.component';
import { ClientesComponent } from './pages/admin/clientes/clientes.component';
import { ContasPagarComponent } from './pages/admin/contas-pagar/contas-pagar.component';
import { ContasReceberComponent } from './pages/admin/contas-receber/contas-receber.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { DocumentosComponent } from './pages/admin/documentos/documentos.component';
import { EmpresasComponent } from './pages/admin/empresas/empresas.component';
import { EnderecosComponent } from './pages/admin/enderecos/enderecos.component';
import { EstoquesComponent } from './pages/admin/estoques/estoques.component';
import { PedidosComponent } from './pages/admin/pedidos/pedidos.component';
import { ProdutosComponent } from './pages/admin/produtos/produtos.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin', component: SidenavComponent,
    // canActivate: [AdminGuard],
    children: [
      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'beneficiarios',
        component: BeneficiariosComponent
      },
      {
        path: 'documentos',
        component: DocumentosComponent
      },
      {
        path: 'categorias',
        component: CategoriasComponent
      },
      {
        path: 'empresas',
        component: EmpresasComponent
      },
      {
        path: 'enderecos',
        component: EnderecosComponent
      },
      {
        path: 'produtos',
        component: ProdutosComponent
      },
      {
        path: 'estoques',
        component: EstoquesComponent
      },
      {
        path: 'clientes',
        component: ClientesComponent
      },
      {
        path: 'pedidos',
        component: PedidosComponent
      },
      {
        path: 'contas-receber',
        component: ContasReceberComponent
      },
      {
        path: 'contas-pagar',
        component: ContasPagarComponent
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }