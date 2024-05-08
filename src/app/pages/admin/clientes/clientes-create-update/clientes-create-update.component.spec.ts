import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientesCreateUpdateComponent } from './clientes-create-update.component';

describe('ClientesCreateUpdateComponent', () => {
  let component: ClientesCreateUpdateComponent;
  let fixture: ComponentFixture<ClientesCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientesCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientesCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
