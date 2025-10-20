import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  getImageUrl(url: string): string {
    // Si l'URL est déjà une URL Cloudinary (commence par https://), on la retourne telle quelle
    if (url.startsWith('https://')) {
      return url;
    }

    // Sinon, on construit l'URL complète en utilisant l'URL de l'API
    return `${environment.apiUrl}${url}`;
  }
}
