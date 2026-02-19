import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'ta-camera-capture',
  standalone: true,
  imports: [CommonModule, NzSpinModule],
  templateUrl: './camera-capture.component.html',
  styleUrls: ['./camera-capture.component.scss']
})
export class CameraCaptureComponent implements OnDestroy {

  /** Emits the uploaded attachment data: { attachment_name, attachment_path, file_size } */
  @Output() captured = new EventEmitter<any>();

  /** Upload endpoint (relative URL, interceptor prepends baseUrl) */
  @Input() uploadUrl = 'masters/uploads/';

  @ViewChild('cameraVideo') private videoRef?: ElementRef<HTMLVideoElement>;

  // State
  isModalOpen = false;
  isCameraSupported = false;
  isCameraReady = false;
  isConnecting = false;
  cameraError: string | null = null;
  isUploading = false;
  capturedImageUrl: string | null = null;

  // Camera
  private stream: MediaStream | null = null;
  private videoEl: HTMLVideoElement | null = null;
  private facingMode: 'user' | 'environment' = 'environment';
  private hasMultipleCameras = false;

  // Lifecycle cleanup
  private destroy$ = new Subject<void>();
  private pendingTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor(private http: HttpClient) {
    this.isCameraSupported = !!(navigator.mediaDevices?.getUserMedia);
  }

  ngOnDestroy(): void {
    this.stopCamera();
    this.pendingTimeouts.forEach(id => clearTimeout(id));
    this.pendingTimeouts = [];
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── PUBLIC ACTIONS ────────────────────────────────────────

  async openModal(): Promise<void> {
    this.isModalOpen = true;
    this.cameraError = null;
    this.capturedImageUrl = null;
    this.isUploading = false;
    this.isCameraReady = false;
    this.isConnecting = true;
    // Await camera detection so hasMultipleCameras is accurate before rendering
    await this.detectMultipleCameras();
    // Wait for DOM to render before starting camera
    this.scheduleTimeout(() => this.startCamera(), 100);
  }

  /** Only close modal if not uploading (matches header close button's [disabled]="isUploading") */
  onBackdropClick(): void {
    if (!this.isUploading) {
      this.closeModal();
    }
  }

  closeModal(): void {
    this.stopCamera();
    this.isModalOpen = false;
    this.capturedImageUrl = null;
    this.cameraError = null;
    this.isUploading = false;
    this.isCameraReady = false;
    this.isConnecting = false;
  }

  capturePhoto(): void {
    // Guard: only capture if camera stream is active and ready
    if (!this.videoEl || !this.stream || !this.isCameraReady) return;

    const canvas = document.createElement('canvas');
    canvas.width = this.videoEl.videoWidth;
    canvas.height = this.videoEl.videoHeight;

    // Reject if video dimensions are zero (no real frame)
    if (canvas.width === 0 || canvas.height === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(this.videoEl, 0, 0, canvas.width, canvas.height);
    this.capturedImageUrl = canvas.toDataURL('image/jpeg', 0.85);

    // Stop camera stream while previewing
    this.stopCamera();
  }

  retake(): void {
    this.capturedImageUrl = null;
    this.cameraError = null;
    this.isCameraReady = false;
    this.isConnecting = true;
    this.scheduleTimeout(() => this.startCamera(), 100);
  }

  usePhoto(): void {
    if (!this.capturedImageUrl) return;

    this.isUploading = true;

    // Convert data URL to Blob → File
    const blob = this.dataUrlToBlob(this.capturedImageUrl);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `camera_capture_${timestamp}.jpg`;
    const file = new File([blob], fileName, { type: 'image/jpeg' });

    // Upload using FormData to the same endpoint
    const formData = new FormData();
    formData.append('files', file);

    this.http.post<any>(this.uploadUrl, formData).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (res) => {
        this.isUploading = false;
        if (res?.data && res.data.length > 0) {
          const attachment = res.data[0];
          this.captured.emit({
            uid: `camera_${Date.now()}`,
            name: attachment.attachment_name,
            attachment_id: attachment.attachment_id,
            attachment_name: attachment.attachment_name,
            attachment_path: attachment.attachment_path,
            file_size: attachment.file_size
          });
          this.closeModal();
        } else {
          this.cameraError = 'Upload succeeded but no file data was returned. Please try again.';
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.cameraError = 'Failed to upload photo. Please try again.';
        console.error('Camera capture upload error:', err);
      }
    });
  }

  switchCamera(): void {
    this.facingMode = this.facingMode === 'user' ? 'environment' : 'user';
    this.stopCamera();
    this.scheduleTimeout(() => this.startCamera(), 100);
  }

  // ─── PRIVATE HELPERS ───────────────────────────────────────

  private async startCamera(): Promise<void> {
    this.cameraError = null;
    this.capturedImageUrl = null;
    this.isCameraReady = false;
    this.isConnecting = true;
    this.videoEl = this.videoRef?.nativeElement || document.getElementById('cameraVideo') as HTMLVideoElement;
    if (!this.videoEl) {
      this.isConnecting = false;
      return;
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: this.facingMode }
      });
      this.videoEl.srcObject = this.stream;
      await this.videoEl.play();
      this.isCameraReady = true;
      this.isConnecting = false;
    } catch (err: any) {
      this.isCameraReady = false;
      this.isConnecting = false;
      this.capturedImageUrl = null;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        this.cameraError = 'Camera access denied. Please allow camera permission in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        this.cameraError = 'No camera found on this device.';
      } else {
        this.cameraError = 'Unable to access camera. Please try again.';
      }
      console.error('Camera access error:', err);
    }
  }

  private stopCamera(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
    if (this.videoEl) {
      this.videoEl.srcObject = null;
    }
  }

  private async detectMultipleCameras(): Promise<void> {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      this.hasMultipleCameras = videoDevices.length > 1;
    } catch {
      this.hasMultipleCameras = false;
    }
  }

  get showSwitchCamera(): boolean {
    return this.hasMultipleCameras;
  }

  private dataUrlToBlob(dataUrl: string): Blob {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.includes(',')) {
      throw new Error('Invalid data URL provided');
    }
    const parts = dataUrl.split(',');
    if (parts.length < 2) {
      throw new Error('Malformed data URL: missing data segment');
    }
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    let byteString: string;
    try {
      byteString = atob(parts[1]);
    } catch (e) {
      throw new Error('Invalid base64 data in data URL');
    }
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mime });
  }

  /** Schedule a timeout and track it for cleanup */
  private scheduleTimeout(fn: () => void, delay: number): void {
    const id = setTimeout(() => {
      this.pendingTimeouts = this.pendingTimeouts.filter(t => t !== id);
      fn();
    }, delay);
    this.pendingTimeouts.push(id);
  }
}
