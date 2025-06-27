import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FileInfo, UploadService } from '../../uploads/upload.service';

@Component({
  selector: 'app-documentos-nucleo',
  templateUrl: './documentos-nucleo.component.html',
  styleUrls: ['./documentos-nucleo.component.scss']
})
export class DocumentosNucleoComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
    files: FileInfo[] = [];
    selectedFile?: File;
    editingFile: FileInfo | null = null;
    newFileName: string = '';
    errorMessage: string = '';
    successMessage: string = '';
    userRole: string = 'viewer';
    justificativa: string = '';
    selectedDoc: FileInfo | null = null;
    action: 'approve' | 'reject' | 'approveGeral' | 'rejectGeral' = 'approve';
    modalRef!: NgbModalRef;
    hasActiveDoc: boolean = false;

    constructor(private svc: UploadService, public modalService: NgbModal) { }

  ngOnInit() {
    this.load();
    this.svc.getUserRole().subscribe({
      next: (res) => {
        this.userRole = res.role;
        console.log('User role:', this.userRole);
      },
      error: (err) => {
        console.error('Erro ao carregar role do usuário:', err);
        this.errorMessage = err.message || 'Erro ao carregar permissões';
      }
    });
  }

  load() {
    this.svc.listFiles('nucleo').subscribe({
      next: (files) => {
        console.log('Arquivos recebidos:', files);
        this.files = files;
        this.files.forEach(f => console.log('file path:', f.path));
        this.hasActiveDoc = this.files.some(f => f.ativo && new Date(f.created_at!).getFullYear() === new Date().getFullYear());
        this.clearMessages();
      },
      error: (err) => {
        console.error('Erro ao carregar arquivos:', err);
        this.setErrorMessage(err.message || 'Erro ao carregar arquivos');
      }
    });
  }

  onFileSelected(evt: Event) {
    const inp = evt.target as HTMLInputElement;
    if (inp.files && inp.files.length > 0) {
      this.selectedFile = inp.files[0];
      console.log('Arquivo selecionado:', this.selectedFile.name);
    } else {
      this.selectedFile = undefined;
    }
  }

  onUpload() {
    if (!this.selectedFile) {
      console.warn('Nenhum arquivo selecionado');
      this.setErrorMessage('Selecione um arquivo para upload');
      return;
    }
    this.svc.uploadFile(this.selectedFile, 'nucleo').subscribe({
      next: (res) => {
        console.log('Upload bem-sucedido:', res);
        this.files.unshift(res);
        if (res.ativo && new Date(res.created_at!).getFullYear() === new Date().getFullYear()) {
          this.hasActiveDoc = true;
        }
        this.selectedFile = undefined;
        this.fileInput.nativeElement.value = '';
        this.setSuccessMessage(`Arquivo "${res.name}" enviado com sucesso!`);
      },
      error: (err) => {
        console.error('Erro no upload:', err);
        this.setErrorMessage(err.message || 'Erro ao fazer upload do arquivo');
      }
    });
  }

  onDownload(doc: FileInfo) {
    this.svc.getSignedUrl(doc.path, 'nucleo').subscribe({
      next: (res) => {
        const link = document.createElement('a');
        link.href = res.url;
        link.download = doc.name;
        link.click();
      },
      error: (err) => {
        console.error('Erro ao gerar URL de download: ', err);
      }
    });
  }

  startEdit(doc: FileInfo) {
    this.editingFile = doc;
    this.newFileName = doc.name;
  }

  cancelEdit() {
    this.editingFile = null;
    this.newFileName = '';
  }

  saveEdit() {
    if (!this.editingFile || !this.newFileName.trim()) {
      this.setErrorMessage('O nome do arquivo não pode estar vazio');
      return;
    }
    if (!this.newFileName.match(/\.[a-zA-Z0-9]+$/)) {
      this.setErrorMessage('O nome do arquivo deve incluir uma extensão válida (ex.: .pdf, .jpg)');
      return;
    }
    this.svc.updateFile(this.editingFile.id, this.newFileName, 'nucleo').subscribe({
      next: (res) => {
        console.log('Arquivo renomeado com sucesso:', res);
        const index = this.files.findIndex(f => f.id === res.id);
        if (index !== -1) {
          this.files[index] = res;
        }
        this.setSuccessMessage(`Arquivo renomeado para "${res.name}" com sucesso!`);
        this.cancelEdit();
      },
      error: (err) => {
        console.error('Erro ao renomear arquivo:', err);
        this.setErrorMessage(err.message || 'Erro ao renomear arquivo');
        if (err.status === 404) {
          this.load();
          this.cancelEdit();
        }
      }
    });
  }

  onDelete(doc: FileInfo) {
    if (!confirm(`Tem certeza que deseja excluir o arquivo "${doc.name}"?`)) {
      return;
    }
    this.svc.deleteFile(doc.id, 'nucleo').subscribe({
      next: () => {
        console.log('Arquivo excluído com sucesso:', doc.name);
        this.files = this.files.filter(f => f.id !== doc.id);
        this.hasActiveDoc = this.files.some(f => f.ativo && new Date(f.created_at!).getFullYear() === new Date().getFullYear());
        this.setSuccessMessage(`Arquivo "${doc.name}" excluído com sucesso!`);
      },
      error: (err) => {
        console.error('Erro ao excluir arquivo:', err);
        this.setErrorMessage(err.message || 'Erro ao excluir arquivo');
      }
    });
  }

  openJustificativa(modalContent: any, action: 'approve' | 'reject' | 'approveGeral' | 'rejectGeral', doc: FileInfo) {
    this.action = action;
    this.selectedDoc = doc;
    this.justificativa = '';
    this.modalRef = this.modalService.open(modalContent, { container: '.app' });
  }

  confirmAction() {
    if (!this.selectedDoc) {
      return;
    }
    let req: Observable<{ message: string }>;
    if (this.action === 'approve') {
      req = this.svc.approveFile(this.selectedDoc.id, this.justificativa);
    } else if (this.action === 'reject') {
      req = this.svc.rejectFile(this.selectedDoc.id, this.justificativa);
    } else if (this.action === 'approveGeral') {
      req = this.svc.approveFileGeral(this.selectedDoc.id, this.justificativa);
    } else {
      req = this.svc.rejectFileGeral(this.selectedDoc.id, this.justificativa);
    }

    req.subscribe({
      next: () => {
        if (this.action === 'approve') {
          this.selectedDoc!.status = 'Aprovado Coordenador';
        } else if (this.action === 'reject') {
          this.selectedDoc!.status = 'Rejeitado Coordenador';
          this.selectedDoc!.ativo = false;
        } else if (this.action === 'approveGeral') {
          this.selectedDoc!.status = 'Aprovado Coordenador Geral';
        } else {
          this.selectedDoc!.status = 'Rejeitado Coordenador Geral';
          this.selectedDoc!.ativo = false;
        }
        const msg = this.action.includes('approve') ? 'aprovado' : 'rejeitado';
        this.setSuccessMessage(`Arquivo "${this.selectedDoc!.name}" ${msg} com sucesso!`);
        this.hasActiveDoc = this.files.some(f => f.ativo && new Date(f.created_at!).getFullYear() === new Date().getFullYear());
        this.modalRef.close();
      },
      error: (err) => {
        console.error('Erro ao processar ação:', err);
        this.setErrorMessage(err.message || 'Erro ao processar ação');
      }
    });
  }

  private setSuccessMessage(message: string) {
    this.successMessage = message;
    this.errorMessage = '';
    setTimeout(() => this.clearMessages(), 5000); 
  }

  private setErrorMessage(message: string) {
    this.errorMessage = message;
    this.successMessage = '';
    setTimeout(() => this.clearMessages(), 5000);
  }

  private clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }

}
