/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SupabaseService } from './supabase.service';

describe('Service: Supabase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupabaseService]
    });
  });

  it('should ...', inject([SupabaseService], (service: SupabaseService) => {
    expect(service).toBeTruthy();
  }));
});
