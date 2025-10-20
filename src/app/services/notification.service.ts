import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Notification {
  id: number;
  userId: number;
  type: 'GENERAL' | 'REPUBLISH';
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/api/notifications`;
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) {}

  getNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.apiUrl);
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${notificationId}/read`, {});
  }

  markAllAsRead(): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/mark-all-read`, {});
  }

  getUnreadCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/unread-count`);
  }

  // Local state management
  setNotifications(notifications: Notification[]): void {
    this.notificationsSubject.next(notifications);
  }

  addNotification(notification: Notification): void {
    const current = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...current]);
  }

  markNotificationAsRead(notificationId: number): void {
    const current = this.notificationsSubject.value;
    const updated = current.map(n =>
      n.id === notificationId ? { ...n, isRead: true } : n
    );
    this.notificationsSubject.next(updated);
  }

  getUnreadNotificationsCount(): number {
    return this.notificationsSubject.value.filter(n => !n.isRead).length;
  }
}
