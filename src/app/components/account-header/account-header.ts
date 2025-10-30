import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-account-header',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './account-header.html',
  styleUrl: './account-header.scss',
})
export class AccountHeader {
  faChevronDown = faChevronDown;
  showMenu = false;
  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  onLogout = () => {
    this.showMenu = !this.showMenu;
  };

}
