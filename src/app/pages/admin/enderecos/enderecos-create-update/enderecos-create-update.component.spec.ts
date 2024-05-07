import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnderecosCreateUpdateComponent } from './enderecos-create-update.component';

describe('EnderecosCreateUpdateComponent', () => {
  let component: EnderecosCreateUpdateComponent;
  let fixture: ComponentFixture<EnderecosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EnderecosCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EnderecosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
