import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasPagarCreateUpdateComponent } from './contasPagar-create-update.component';

describe('ContasPagarCreateUpdateComponent', () => {
  let component: ContasPagarCreateUpdateComponent;
  let fixture: ComponentFixture<ContasPagarCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContasPagarCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasPagarCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
