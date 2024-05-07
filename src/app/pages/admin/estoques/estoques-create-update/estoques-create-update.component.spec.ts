import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoquesCreateUpdateComponent } from './estoques-create-update.component';

describe('EstoquesCreateUpdateComponent', () => {
  let component: EstoquesCreateUpdateComponent;
  let fixture: ComponentFixture<EstoquesCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EstoquesCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstoquesCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
