import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccountHeader } from '../../components/account-header/account-header';
import { SidebarMenu } from '../../components/sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-desktop-layout',
  imports: [RouterOutlet, AccountHeader, SidebarMenu],
  templateUrl: './desktop-layout.html',
  styleUrl: './desktop-layout.scss',
})
export class DesktopLayout {

}
