import { Component } from '@angular/core';
import { navItens } from './nav-itens';

@Component({
  selector: 'abs-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  navItens = navItens;
  isExpanded = true;

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
  }
}
