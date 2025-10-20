import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ZWAVE_LOGO, USER_AVATAR } from '../../constants/images';

@Component({
  selector: 'app-headerdashboard',
  imports: [CommonModule],
  templateUrl: './headerdashboard.component.html',
  styleUrl: './headerdashboard.component.scss'
})
export class HeaderdashboardComponent {
       @Input() userName: string = '';

  menuItems = ['Dashboard', 'Sales', 'Customers', 'Reports', 'Orders'];
  activeMenu = 'Dashboard';
  zwaveLogo = ZWAVE_LOGO;
  userAvatar = USER_AVATAR;

  selectMenu(item: string): void {
    this.activeMenu = item;
  }
}
