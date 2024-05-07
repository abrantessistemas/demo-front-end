import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoriasCreateUpdateComponent } from './categorias-create-update.component';

describe('CategoriasCreateUpdateComponent', () => {
  let component: CategoriasCreateUpdateComponent;
  let fixture: ComponentFixture<CategoriasCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoriasCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
