/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ChatBoxService } from './chat-box.service';

describe('ChatBoxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChatBoxService]
    });
  });

  it('should ...', inject([ChatBoxService], (service: ChatBoxService) => {
    expect(service).toBeTruthy();
  }));
});
