import { Component } from '@angular/core';
import { UploadService } from './upload.service';

@Component({
  selector: 'app-upload',
  template: `
    <h2>Upload de Arquivo</h2>
    <input type="file" (change)="onFileSelected($event)" />
    <button [disabled]="!selectedFile" (click)="onUpload()">Enviar</button>

    <div *ngIf="fileUrl">
      <p>Arquivo enviado! URL pública:</p>
      <a [href]="fileUrl" target="_blank">{{ fileUrl }}</a>
      <!-- Se for imagem, poderíamos exibir com <img [src]="fileUrl"> -->
    </div>
  `
})
export class UploadsComponent {
  selectedFile?: File;
  fileUrl?: string;  // URL retornada do backend

  constructor(private uploadService: UploadService) {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload() {
    if (!this.selectedFile) return;
    this.uploadService.uploadFile(this.selectedFile)
      .subscribe(response => {
        this.fileUrl = response.url;
      }, error => {
        console.error('Erro no upload:', error);
      });
  }
}