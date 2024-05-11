import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EmpresaModel } from 'src/app/pages/admin/empresas/model/empresa.model';
import { EmpresaService } from 'src/app/pages/admin/empresas/model/empresa.service';
import { DemoDataService } from 'src/app/services/demo-data.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'abs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() openProfileEvent = new EventEmitter<void>();
  @Input() isExpanded = false;
  empresa!: EmpresaModel;
  dataMode!: string;

  constructor(private data: DemoDataService, private util: UtilService, private empresaService: EmpresaService) {

  }
  ngOnInit(): void {
    this.dataMode = '' + localStorage.getItem('dadosMode');
    this.util.modoOperacional = this.dataMode;
    this.buscarDadosEmpresa();
  }

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    this.sidenavToggle.emit();
  }

  setDadosMode() {
    localStorage.setItem('dadosMode', this.dataMode);
    this.util.modoOperacional = this.dataMode;
    this.buscarDadosEmpresa();

  }

  buscarDadosEmpresa() {
    if (this.dataMode === 'demo') {
     this.empresa = this.data.empresa[0];
     
    } else {
      this.empresaService.findAll().subscribe(result => {
        //this.empresa = result.data[0];
      })
    }
  }

  openProfile() {
    this.openProfileEvent.emit();
  }

}
