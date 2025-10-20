import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { Camera as CapacitorCamera, CameraDirection, CameraResultType, CameraSource } from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class CameraService {
  async takePhoto(): Promise<string | null> {
    if (Capacitor.isNativePlatform()) {
      // Native platform (mobile/tablet)
      try {
        const image = await CapacitorCamera.getPhoto({
          quality: 90,
          allowEditing: false,
          resultType: CameraResultType.Base64,
          source: CameraSource.Camera,
          direction: CameraDirection.Rear
        });
        return image.base64String ? 'data:image/jpeg;base64,' + image.base64String : null;
      } catch (error) {
        console.error('Error taking photo on native:', error);
        throw error;
      }
    } else {
      // Web platform (desktop) - Interactive camera preview
      return new Promise((resolve, reject) => {
        try {
          const stream = navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 640 },
              height: { ideal: 480 }
            }
          });

          stream.then(async (mediaStream) => {
            const modal = document.createElement('div');
            modal.id = 'camera-modal';
            modal.style.cssText = `
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: rgba(0,0,0,0.8);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 9999;
              flex-direction: column;
            `;

            const video = document.createElement('video');
            video.srcObject = mediaStream;
            video.muted = true;
            video.playsInline = true;
            video.style.cssText = `
              width: 80%;
              max-width: 640px;
              height: auto;
              border-radius: 8px;
              background: black;
            `;

            const captureBtn = document.createElement('button');
            captureBtn.textContent = 'Prendre la Photo';
            captureBtn.style.cssText = `
              margin-top: 20px;
              padding: 12px 24px;
              background: #007bff;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 16px;
              cursor: pointer;
            `;

            const cancelBtn = document.createElement('button');
            cancelBtn.textContent = 'Annuler';
            cancelBtn.style.cssText = `
              margin-top: 10px;
              padding: 10px 20px;
              background: #6c757d;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 14px;
              cursor: pointer;
            `;

            const closeModal = () => {
              document.body.removeChild(modal);
              mediaStream.getTracks().forEach(track => track.stop());
            };

            cancelBtn.onclick = closeModal;

            captureBtn.onclick = () => {
              const canvas = document.createElement('canvas');
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(video, 0, 0);
                closeModal();
                resolve(canvas.toDataURL('image/jpeg', 0.9));
              } else {
                closeModal();
                reject(new Error('Cannot get canvas context'));
              }
            };

            video.onloadedmetadata = () => {
              video.play().catch(reject);
            };

            video.onerror = () => {
              closeModal();
              reject(new Error('Failed to load video stream'));
            };

            modal.appendChild(video);
            modal.appendChild(captureBtn);
            modal.appendChild(cancelBtn);
            document.body.appendChild(modal);

            // Focus on capture button for accessibility
            setTimeout(() => captureBtn.focus(), 100);

          }).catch(reject);

        } catch (error) {
          console.error('Error accessing camera on web:', error);
          reject(error);
        }
      });
    }
  }

  async selectPhoto(): Promise<string | null> {
    try {
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos
      });

      return image.base64String || null;
    } catch (error) {
      console.error('Error selecting photo:', error);
      return null;
    }
  }
}
