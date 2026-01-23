import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoggerService } from '../services/logger';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  constructor(
    private logger: LoggerService,
    private snackBar: MatSnackBar,
    private zone: NgZone
  ) {}

  handleError(error: unknown): void {
    const errorId = this.logger.error('Unhandled UI error', { error });

    this.zone.run(() => {
      this.snackBar.open(`Something went wrong. Error ID: ${errorId}`, 'Dismiss', {
        duration: 7000
      });
    });

    // Keep console error for debugging
    console.error(error);
  }
}
