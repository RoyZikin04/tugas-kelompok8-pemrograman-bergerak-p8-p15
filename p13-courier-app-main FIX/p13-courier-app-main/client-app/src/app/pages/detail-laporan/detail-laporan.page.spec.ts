import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailLaporanPage } from './detail-laporan.page';

describe('DetailLaporanPage', () => {
  let component: DetailLaporanPage;
  let fixture: ComponentFixture<DetailLaporanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailLaporanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
