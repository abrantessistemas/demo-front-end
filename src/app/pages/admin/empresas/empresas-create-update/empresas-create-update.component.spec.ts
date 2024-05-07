import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpresasCreateUpdateComponent } from './empresas-create-update.component';

describe('EmpresasCreateUpdateComponent', () => {
  let component: EmpresasCreateUpdateComponent;
  let fixture: ComponentFixture<EmpresasCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmpresasCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmpresasCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
