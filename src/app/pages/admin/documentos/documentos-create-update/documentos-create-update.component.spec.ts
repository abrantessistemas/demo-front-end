import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosCreateUpdateComponent } from './documentos-create-update.component';

describe('DocumentosCreateUpdateComponent', () => {
  let component: DocumentosCreateUpdateComponent;
  let fixture: ComponentFixture<DocumentosCreateUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DocumentosCreateUpdateComponent]
    });
    fixture = TestBed.createComponent(DocumentosCreateUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
