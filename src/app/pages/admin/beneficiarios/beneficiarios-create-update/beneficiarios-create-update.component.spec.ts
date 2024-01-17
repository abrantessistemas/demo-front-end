import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficiariosCreateUpdateComponent } from './beneficiarios-create-update.component';

describe('BeneficiariosCreateUpdateComponent', () => {
  let component: BeneficiariosCreateUpdateComponent;
  let fixture: ComponentFixture<BeneficiariosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BeneficiariosCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BeneficiariosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
