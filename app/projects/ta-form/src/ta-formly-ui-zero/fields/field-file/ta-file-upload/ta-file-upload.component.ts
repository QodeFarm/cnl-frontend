import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzUploadChangeParam, NzUploadFile, NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Observable, Observer } from 'rxjs';
@Component({
  selector: 'ta-file-upload',
  standalone: true,
  imports: [CommonModule, NzUploadModule],
  templateUrl: './ta-file-upload.component.html',
  styleUrls: ['./ta-file-upload.component.css']
})
export class TaFileUploadComponent implements OnInit {
  @Input() options: any;
  loading = false;
  avatarUrl?: string;
  fileList: NzUploadFile[] = [];

  constructor(private msg: NzMessageService) { }
  ngOnInit(): void {
    if (!this.options.url) {
      this.options.url = 'masters/uploads/';
    }
  }
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]): Observable<boolean> =>
    new Observable((observer: Observer<boolean>) => {
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
      observer.next(isJpgOrPng && isLt2M);
      observer.complete();
    });

  private getBase64(img: File, callback: (img: string) => void): void {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result!.toString()));
    reader.readAsDataURL(img);
  }

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    //fileList = fileList.slice(-2);
    debugger;
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url as link
        file.filename = file.response.data[0].attachment_name;
        file.url = file.response.data[0].attachment_path;
      }
      return file;
    });
    this.fileList = fileList;
    switch (info.file.status) {
      case 'uploading':
        this.loading = true;
        break;
      case 'done':
        // Get this url from response in real world.
        this.getBase64(info.file!.originFileObj!, (img: string) => {
          this.loading = false;
          this.avatarUrl = img;
        });

        if (this.options.doneFn) {
          this.options.doneFn(this.fileList);
        }
        break;
      case 'error':
        this.msg.error('Network error');
        this.loading = false;
        break;
    }
  }
}
