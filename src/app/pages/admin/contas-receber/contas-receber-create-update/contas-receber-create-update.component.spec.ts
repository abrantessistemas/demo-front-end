import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContasReceberCreateUpdateComponent } from './contasReceber-create-update.component';

describe('ContasReceberCreateUpdateComponent', () => {
  let component: ContasReceberCreateUpdateComponent;
  let fixture: ComponentFixture<ContasReceberCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContasReceberCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContasReceberCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
