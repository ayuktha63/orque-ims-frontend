import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../../shared/breadcrumbs/breadcrumbs';
import { SidebarComponent } from '../sidebar/sidebar';
import { TopbarComponent } from '../topbar/topbar';
@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, TopbarComponent, SidebarComponent, BreadcrumbsComponent],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.css']
})
export class AppShellComponent {}
