import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { LOGO_IMAGE } from '../../constants/images';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDropdownOpen = false;
  userInitials = '';
  isLoggedIn = false;
  logoImage = LOGO_IMAGE;
  private subscriptions = new Subscription();

  // Notifications
  showNotifications = false;
  notifications: any[] = [];
  unreadNotificationsCount = 0;

  constructor(
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.authService.isLoggedIn$.subscribe(loggedIn => {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
          this.loadNotifications();
        }
      })
    );

    this.subscriptions.add(
      this.authService.userName$.subscribe(userName => {
        if (userName) {
          this.userInitials = userName.substring(0, 2).toUpperCase();
        } else {
          this.userInitials = '';
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  handleProfile(): void {
    console.log('Profile clicked');
    this.isDropdownOpen = false;
  }

  handleSettings(): void {
    console.log('Settings clicked');
    this.isDropdownOpen = false;
  }

  handleLogin(): void {
    this.router.navigate(['/login']);
    this.isDropdownOpen = false;
  }

  handleLogout(): void {
    this.authService.removeToken();
    this.authService.removeUserName();
    this.authService.removeUserId();
    this.router.navigate(['/']);
    this.isDropdownOpen = false;
  }

  // Notification methods
  loadNotifications(): void {
    if (this.authService.getToken()) {
      this.notificationService.getNotifications().subscribe({
        next: (notifications) => {
          this.notifications = notifications;
          this.unreadNotificationsCount = notifications.filter(n => !n.isRead).length;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
        }
      });
    }
  }

  toggleNotifications(): void {
    this.showNotifications = !this.showNotifications;
    this.isDropdownOpen = false; // Close user dropdown
  }

  markAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.notifications = this.notifications.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        );
        this.unreadNotificationsCount = Math.max(0, this.unreadNotificationsCount - 1);
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications = this.notifications.map(n => ({ ...n, isRead: true }));
        this.unreadNotificationsCount = 0;
      },
      error: (error) => {
        console.error('Error marking all notifications as read:', error);
      }
    });
  }

  getNotificationIcon(type: string): string {
    switch (type) {
      case 'GENERAL':
        return 'fa-info-circle';
      case 'REPUBLISH':
        return 'fa-redo';
      default:
        return 'fa-bell';
    }
  }

}
