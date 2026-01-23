import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';

type Crumb = { label: string; url: string };

@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumbs.html',
  styleUrls: ['./breadcrumbs.css']
})
export class BreadcrumbsComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  crumbs: Crumb[] = [];

  constructor() {
    // initial build
    this.crumbs = this.buildCrumbs(this.route.root);

    // rebuild on every navigation end
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        this.crumbs = this.buildCrumbs(this.route.root);
      });
  }

  private buildCrumbs(route: ActivatedRoute, url: string = '', out: Crumb[] = []): Crumb[] {
    const children = route.children;
    if (!children || children.length === 0) return out;

    for (const child of children) {
      // snapshot.url can be undefined in some redirect/empty states
      const segments = child.snapshot?.url ?? [];
      const segmentPath = segments.map(s => s.path).filter(Boolean).join('/');

      const nextUrl = segmentPath ? `${url}/${segmentPath}` : url;

      const label = child.snapshot?.data?.['breadcrumb'] as string | undefined;
      if (label) {
        // ensure we always have a usable url
        out.push({ label, url: nextUrl || '/' });
      }

      return this.buildCrumbs(child, nextUrl, out);
    }

    return out;
  }
}
