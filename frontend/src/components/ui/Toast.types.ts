export type ToastTone = 'success' | 'error';

export interface ToastMessage {
  id: number;
  text: string;
  tone: ToastTone;
}
