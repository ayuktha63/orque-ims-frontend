import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnInit,
  DestroyRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { Toast } from './toast.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent implements OnInit {

  private destroyRef = inject(DestroyRef);

  toasts: Toast[] = [];

  constructor(
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.toastService.toast$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((toast) => {

        // push in next macrotask (prevents NG0100)
        setTimeout(() => {

          this.toasts = [...this.toasts, toast];
          this.cdr.markForCheck();

          // auto remove
          setTimeout(() => {
            this.remove(toast.id);
          }, toast.duration || 3000);

        });

      });

  }

  onClose(event: MouseEvent, id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.remove(id);
  }

  remove(id: number) {
    this.toasts = this.toasts.filter(t => t.id !== id);
    this.cdr.markForCheck();
  }
}