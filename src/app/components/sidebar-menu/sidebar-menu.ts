import { Component } from '@angular/core';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs';

interface Menu {
  menu_name: string;
  route?: string;
}

@Component({
  selector: 'sidebar-menu',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, RouterModule],
  templateUrl: './sidebar-menu.html',
  styleUrls: ['./sidebar-menu.scss'],
})
export class SidebarMenu {
  faChevronDown = faChevronDown;
  faChevronUp = faChevronUp;

  groupedMenus: Record<string, Menu[]> = {
    Dashboard: [
      { menu_name: 'Analytic', route: '/' },
    ],
    Reports: [
      { menu_name: 'Ofiice Location', route: '/office-location' },
      { menu_name: 'Attendance', route: '/attendance' },
      { menu_name: 'Purposes', route: '/purposes' },
    ],
    Master: [
      { menu_name: 'Users', route: '/user' },
    ],
    Settings: [
      { menu_name: 'Preferences', route: '/preferences' },
      { menu_name: 'Security', route: '/security' },
    ],
  };

  groupedMenuKeys = Object.keys(this.groupedMenus);
  openGroups: Record<string, boolean> = {};
  activeMenu: Menu | null = null;
  sidebarOpen = true;

  constructor(private readonly router: Router) {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.updateActiveMenu(url);
      });
    this.updateActiveMenu(this.router.url);
  }

  toggleGroup(group: string) {
    this.openGroups[group] = !this.openGroups[group];
  }

  isGroupOpen(group: string) {
    return !!this.openGroups[group];
  }

  setActive(menu: Menu) {
    this.activeMenu = menu;
  }

  isActive(menu: Menu) {
    return this.activeMenu?.route === menu.route;
  }

  toggleSideMenu() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  getGroupIcon(group: string) {
    return 'https://via.placeholder.com/16';
  }

  private updateActiveMenu(url: string) {
    for (const group of this.groupedMenuKeys) {
      const found = this.groupedMenus[group].find((menu) => menu.route === url);
      if (found) {
        this.activeMenu = found;
        this.openGroups[group] = true;
        return;
      }
    }
    this.activeMenu = null;
  }
}
