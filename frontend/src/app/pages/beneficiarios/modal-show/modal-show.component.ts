import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BeneficiarioService } from '../shared/beneficiario.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-show',
  templateUrl: './modal-show.component.html',
  styleUrls: ['./modal-show.component.scss']
})
export class ModalShowComponent implements OnInit {
  @Input() beneficiario: any;
  @Input() docBeneficiarios: any;
  avatarForm: FormGroup;
  selectedFiles: FileList;
  progressInfos = [];
  fileInfos: [];
  avatarImage;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private beneficiarioService: BeneficiarioService,
    private toast: ToastrService,
    ) { }

  ngOnInit() {
    this.buildFormAvatar();
    this.createImageFromBlob(this.beneficiario.id);
  }

  private buildFormAvatar() {
    this.avatarForm = this.formBuilder.group({
      id: [null],
      avatar: [null],
    });
  }

  selectFiles(event) {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;

    this.uploadFiles();
    // this.upload(1, )
  }

  uploadFiles() {
    // 
    // this.message = '';

    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }

  }

  upload(idx, file) {

    this.progressInfos[idx] = { value: 0, fileName: file.name };

    this.beneficiarioService.uploadAvatar(file, this.beneficiario.id).subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {

          this.createImageFromBlob(this.beneficiario.id);

        }

      },
      err => {
        this.progressInfos[idx].value = 0;
        const msg = err.error.error ? err.error.error : "Error interno";
        this.toast.error(msg)
      });

  }




  DownloadFile(userId, tipo, arquivo) {
    this.beneficiarioService.downloadDoc(userId, tipo, arquivo).subscribe(
      res => {

        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(res);

        a.href = objectUrl;
        a.target = '_blank';
        a.click();
        URL.revokeObjectURL(objectUrl);

      },
      err => {
        console.log("Erro de arquivo: ", err);
        this.toast.error("Arquivo ainda não enviado!");
      }
    )
  }


  
  createImageFromBlob(beneficiario_id) {
    
    //carregar o preload antes
    this.avatarImage = "assets/img/loading-buffering.gif";

    this.beneficiarioService.getAvatar(beneficiario_id).subscribe(

      image => {
        

        let reader = new FileReader();
        reader.addEventListener("load", () => {
          this.avatarImage = reader.result;
        }, false);

        if (image) {
          reader.readAsDataURL(image);
        }

      },
      error => {
        this.avatarImage = "assets/img/users/default-user.jpg";
      }
    )


  }

}
