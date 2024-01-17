import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'abs-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Output() sidenavToggle = new EventEmitter<void>();
  @Output() openProfileEvent = new EventEmitter<void>();
  @Input() isExpanded = false;

  toggleSidenav() {
    this.isExpanded = !this.isExpanded;
    this.sidenavToggle.emit();
  }

  openProfile() {
    this.openProfileEvent.emit();
  }
  
}
