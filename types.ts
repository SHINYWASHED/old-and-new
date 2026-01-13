
export interface UploadedImage {
  id: string;
  dataUrl: string;
  file: File;
  type: 'child' | 'adult';
}

export interface GenerationResult {
  imageUrl: string;
  prompt: string;
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
