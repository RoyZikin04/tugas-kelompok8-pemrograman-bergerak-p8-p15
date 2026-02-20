import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormLaporanPage } from './form-laporan.page';

describe('FormLaporanPage', () => {
  let component: FormLaporanPage;
  let fixture: ComponentFixture<FormLaporanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormLaporanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
