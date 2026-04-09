import { toast, ToastOptions } from 'react-toastify';

class NotificationService {
  private static instance: NotificationService;

  private defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000, // 3 seconds as requested
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public success(message: string) {
    toast.success(message, this.defaultOptions);
  }

  public error(message: string) {
    toast.error(message, this.defaultOptions);
  }

  public warn(message: string) {
    toast.warn(message, this.defaultOptions);
  }

  public info(message: string) {
    toast.info(message, this.defaultOptions);
  }
}

export const notificationService = NotificationService.getInstance();
