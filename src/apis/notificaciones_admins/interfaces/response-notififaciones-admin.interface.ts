export interface ResponseNotificacionesAdminInterface {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatesAt: Date;
}
