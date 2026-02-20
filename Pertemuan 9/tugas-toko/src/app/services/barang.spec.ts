import { TestBed } from '@angular/core/testing';

import { BarangService } from './barang.service';

describe('BarangService', () => {
  let service: BarangService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BarangService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
