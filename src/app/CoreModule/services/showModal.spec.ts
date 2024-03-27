import {Modal, ModalService, ModalStatus} from './modal.service';
import {TestBed} from '@angular/core/testing';

describe('ModalService', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('should open the modal when showModal is called', () => {
    const spy = spyOn(service.modalVisibilityEvent, 'emit');

    service.showModal(Modal.CONFIRMATION);

    expect(spy).toHaveBeenCalledWith({
      modal: Modal.CONFIRMATION,
      status: ModalStatus.OPEN
    });
  });

});
