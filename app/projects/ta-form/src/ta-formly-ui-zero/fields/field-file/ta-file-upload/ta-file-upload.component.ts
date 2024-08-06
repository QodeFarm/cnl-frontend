import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
import { TaCoreModule } from '@ta/ta-core';
import { NzIconModule } from 'ng-zorro-antd/icon';
@Component({
  selector: 'ta-file-upload',
  standalone: true,
  imports: [CommonModule, NzUploadModule, TaCoreModule, NzIconModule],
  templateUrl: './ta-file-upload.component.html',
  styleUrls: ['./ta-file-upload.component.css']
})
export class TaFileUploadComponent implements OnInit {
  @Input() options: any;
  loading = false;
  avatarUrl?: string;
  showUploadList = true;
  listType = "text";
  storeFolder = 'assets/';
  ///fileList: NzUploadFile[] = [];

  constructor(private msg: NzMessageService) { }
  ngOnInit(): void {
    if (this.options.storeFolder) {
      this.storeFolder = this.options.storeFolder + '/';
    }
    if (!this.options.url) {
      this.options.url = 'masters/uploads/';// + this.storeFolder;
    }
    if (!this.options.fileList) {
      this.options.fileList = [];
    }
    if (this.options.displayStyle == 'avatar') {
      this.listType = 'picture-card';
      this.showUploadList = false;
    } else {
      this.listType = 'picture';
    }
  }
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
      if (this.options.displayStyle == 'avatar') {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          this.msg.error('You can only upload JPG file!');
          observer.complete();
          return;
        }
        const isLt2M = file.size! / 1024 / 1024 < 2;
        if (!isLt2M) {
          this.msg.error('Image must smaller than 2MB!');
          observer.complete();
          return;
        }
        if (this.options.fileList.length > 0) {
          this.options.fileList = [];
        }
        observer.next(isJpgOrPng && isLt2M);
      } else {
        observer.next(true);
      }

      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }
  // transformFile = (file: NzUploadFile): NzUploadFile => {
  //   const suffix = file.name.slice(file.name.lastIndexOf('.'));
  //   console.log('test', file);
  //   const filename = Date.now() + suffix;
  //   file.url = 'http://localhost:3000/bucket/assest/' + filename;

  //   return file;
  // };

  handleChange(info: NzUploadChangeParam): void {
    if (this.options.displayStyle == 'avatar') {
      this.options.fileList = [info.file];
    }

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-2);
    // fileList = fileList.map(file => {
    //   let _file: any = {};
    //   if (file.response) {
    //     _file = file.response.data;
    //     // Component will show file.url as link
    //     file = file.response.data;
    //     _file.filename = file.response.data.originalName;
    //     _file.url = file.response.data.originalName;
    //   }
    //   return file;
    // });
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.


        if (this.options.doneFn) {
          this.options.fileList = this.options.fileList.map(file => {
            if (file.response && file.response.data) {
              const originFileObj: any = file!.originFileObj;
              const resObje: any = file.response.data[0];
              const _file = {
                uid: originFileObj.uid,
                name: resObje.attachment_name,
                ...resObje
              }
              return _file;
            } else {
              return file;
            }
          });
          if (this.options.displayStyle == 'avatar') {
            // this.getBase64(info.file!.originFileObj!, (img: string) => {
            //   this.loading = false;
            //   this.avatarUrl = img;
            // });
            if (this.options.fileList.length > 1) {
              this.options.fileList = [this.options.fileList[this.options.fileList.length - 1]];
            }

            this.avatarUrl = this.options.fileList[0].attachment_path;
          }
          this.options.doneFn(this.options.fileList);
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
  removeFile = (file) => {
    let fileIndex = this.options.fileList.findIndex(f => f.uid == file.uid);
    if (fileIndex > -1) {
      this.options.fileList.splice(fileIndex, 1);
      this.options.doneFn(this.options.fileList);
    }
  }
}
