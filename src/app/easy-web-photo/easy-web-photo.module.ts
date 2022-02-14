import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WebcamModule } from 'ngx-webcam';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';

import { EasyWebPhotoComponent } from './easy-web-photo.component';

import { IconDefinition } from '@ant-design/icons-angular';
import { CameraOutline, ClearOutline, FolderOpenOutline, DownloadOutline, RollbackOutline } from '@ant-design/icons-angular/icons';

const icons: IconDefinition[] = [CameraOutline, ClearOutline, FolderOpenOutline, DownloadOutline, RollbackOutline];
@NgModule({
  declarations: [EasyWebPhotoComponent],
  imports: [
    CommonModule,
    FormsModule,
    WebcamModule,
    ImageCropperModule,
    NzIconModule,
    NzButtonModule,
    NzSliderModule,
    NzGridModule,
    NzCheckboxModule,
    NzIconModule.forRoot(icons)
  ],
  exports: [
    EasyWebPhotoComponent
  ]
})
export class EasyWebPhotoModule { }
