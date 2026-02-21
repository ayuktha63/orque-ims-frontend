import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Toast, ToastType } from '../../shared/ui/toast/toast.model';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  private toastSubject = new Subject<Toast>();
  toast$ = this.toastSubject.asObservable();

  private counter = 0;

  private show(message: string, type: ToastType, duration = 3000) {
    this.toastSubject.next({
      id: ++this.counter,
      message,
      type,
      duration
    });
  }

  success(msg: string) {
    this.show(msg, 'success');
  }

  error(msg: string) {
    this.show(msg, 'error', 4000);
  }

  warning(msg: string) {
    this.show(msg, 'warning');
  }

  info(msg: string) {
    this.show(msg, 'info');
  }
}