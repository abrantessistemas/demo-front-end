import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutosCreateUpdateComponent } from './produtos-create-update.component';

describe('ProdutosCreateUpdateComponent', () => {
  let component: ProdutosCreateUpdateComponent;
  let fixture: ComponentFixture<ProdutosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutosCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProdutosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
