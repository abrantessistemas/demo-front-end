import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosCreateUpdateComponent } from './documentos-create-update.component';

describe('DocumentosCreateUpdateComponent', () => {
  let component: DocumentosCreateUpdateComponent;
  let fixture: ComponentFixture<DocumentosCreateUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentosCreateUpdateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
