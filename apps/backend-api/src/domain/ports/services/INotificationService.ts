// ============================================================
// INotificationService — Port for real-time notifications
// ============================================================

export interface INotificationService {
  notifyUser(userId: string, event: string, data: unknown): void;
  notifyAll(event: string, data: unknown): void;
}
