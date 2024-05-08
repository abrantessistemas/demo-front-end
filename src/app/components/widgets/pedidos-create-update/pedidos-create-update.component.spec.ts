import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosCreateUpdateComponent } from './pedidos-create-update.component';

describe('PedidosCreateUpdateComponent', () => {
  let component: PedidosCreateUpdateComponent;
  let fixture: ComponentFixture<PedidosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PedidosCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PedidosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
