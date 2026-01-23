import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface AppLog {
  id: string;
  level: LogLevel;
  message: string;
  context?: unknown;
  timestamp: string;
}

const LOG_KEY = 'orque_logs_v1';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  private logs: AppLog[] = this.load();

  private newId(): string {
    return crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private save(): void {
    if (!this.isBrowser) return;
    try {
      localStorage.setItem(LOG_KEY, JSON.stringify(this.logs.slice(0, 200)));
    } catch {
      // Ignore quota errors
    }
  }

  private load(): AppLog[] {
    if (!this.isBrowser) return [];
    try {
      const raw = localStorage.getItem(LOG_KEY);
      return raw ? (JSON.parse(raw) as AppLog[]) : [];
    } catch {
      return [];
    }
  }

  private push(level: LogLevel, message: string, context?: unknown): string {
    const id = this.newId();
    const entry: AppLog = {
      id,
      level,
      message,
      context,
      timestamp: new Date().toISOString()
    };

    this.logs.unshift(entry);
    this.logs = this.logs.slice(0, 200);
    this.save();

    if (level === 'ERROR') console.error(`[${id}] ${message}`, context);
    else if (level === 'WARN') console.warn(`[${id}] ${message}`, context);
    else console.log(`[${id}] ${message}`, context);

    return id;
  }

  info(message: string, context?: unknown): string {
    return this.push('INFO', message, context);
  }

  warn(message: string, context?: unknown): string {
    return this.push('WARN', message, context);
  }

  error(message: string, context?: unknown): string {
    return this.push('ERROR', message, context);
  }

  getRecent(): AppLog[] {
    return [...this.logs];
  }

  clear(): void {
    this.logs = [];
    if (this.isBrowser) localStorage.removeItem(LOG_KEY);
  }
}
