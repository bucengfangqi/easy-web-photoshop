import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CropperPosition, ImageCroppedEvent, ImageCropperComponent, ImageTransform } from 'ngx-image-cropper';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { saveAs } from 'file-saver';
import { NzMarks } from 'ng-zorro-antd';

@Component({
  selector: 'easy-web-photo',
  templateUrl: './easy-web-photo.component.html',
  styleUrls: ['./easy-web-photo.component.scss']
})
export class EasyWebPhotoComponent implements OnInit, OnDestroy {
  @ViewChild('cropperA') private readonly cropperA!: ImageCropperComponent;
  @ViewChild('cropperB') private readonly cropperB!: ImageCropperComponent;
  // toggle webcam on/off
  public showWebcam = true;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  // latest snapshot
  public webcamImage: WebcamImage|null = null;
  public allowCameraSwitch = true;
  public deviceId!: string;
  public errors: WebcamInitError[] = [];

  imageChangedEvent: any = null;
  croppedImage: any = '';
  croppedImageSize: string|null = null;
  imageQuality: number = 100; // 图片质量
  maxWidth: number = 300; // 图片最大宽度
  transform = {
    rotate: 0, scale: 1, flipH: false, flipV: false
  }
  transformA: ImageTransform = {};
  transformB: ImageTransform = {};

  private cropperPositionChange: Subject<CropperPosition> = new Subject<CropperPosition>();
  private destory: Subject<void> = new Subject<void>();
  constructor() { }
  ngOnDestroy(): void {
    this.destory.next();
  }

  ngOnInit(): void {
    this.cropperPositionChange
      .pipe(debounceTime(10), takeUntil(this.destory))
      .subscribe(data => {
        if (data) {
          this.cropperOrigin = data;
        }
      })
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  /** 拍照 */
  public triggerSnapshot(): void {
    this.trigger.next();
  }
  /** 捕获到照片 */
  public handleImage(webcamImage: WebcamImage): void {
    this.webcamImage = webcamImage;
    this.toggleWebcam();
  }

  public toggleWebcam(): void {
    if (this.showWebcam) {
      this.showWebcam = false
    } else {
      this.showWebcam = true
      this.webcamImage = null;
      this.imageChangedEvent = null;
    }
  }
  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }
  public cameraWasSwitched(deviceId: string): void {
    console.log('active device: ' + deviceId);
    this.deviceId = deviceId;
  }
  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }



  fileChangeEvent(event: any): void {
    if (event.target.files.length) {
      this.showWebcam = false;
      this.webcamImage = null;
      this.imageChangedEvent = event;
    }
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    this.croppedImageSize = this.calSize(event.base64 as any);
    this.cropperPositionChange.next(event.cropperPosition);
  }
  loadImageFailed() {
    // show message
  }
  cropperOrigin: CropperPosition = { x1: 100, y1: 100, x2: 400, y2: 300 };
  webCamCropper: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };
  imageCropper: CropperPosition = { x1: 0, y1: 0, x2: 0, y2: 0 };

  webCamCropperReady() {
    this.webCamCropper = { ...this.cropperOrigin }
  }
  imageCropperReady() {
    this.imageCropper = { ...this.cropperOrigin }
  }
  /** 本地选择文件 */
  chooseFile(input: any) {
    input.click()
  }
  ngModelChange(value:any) {
    setTimeout(() => {
      if (this.webcamImage && !this.showWebcam) {
        this.cropperA.crop();
        this.transformA = { ...this.transform }
      }
      if (this.imageChangedEvent && !this.showWebcam) {
        this.cropperB.crop();
        this.transformB = { ...this.transform }
      }
    });
  }
  restoration() {
    this.imageQuality = 100; // 图片质量
    this.maxWidth = 300; // 图片最大宽度
    this.transform = {
      rotate: 0, scale: 1, flipH: false, flipV: false
    }
    this.ngModelChange(true);
  }
  saveAs() {
    saveAs(this.croppedImage, "image.jpg");
  }
  // 获取base64图片大小，返回MB数字
  calSize(base64url: string) {
    let str = base64url.replace('data:image/png;base64,', '');
    const equalIndex = str.indexOf('=');
    if (str.indexOf('=') > 0) {
      str = str.substring(0, equalIndex);
    }
    const strLength = str.length;
    const fileLength = strLength - (strLength / 8) * 2;
    // 返回单位为KB的大小
    return (fileLength / (1024)).toFixed(2);
  }
  qualityMarks: NzMarks = {
    0: '0%',
    20: '20%',
    50: '50%',
    80: '80%',
    100: '100%',
  };
  widthMarks: NzMarks = {
    10: '10px',
    100: '100px',
    200: '200px',
    300: '300px',
    400: '400px',
    500: '500px',
    640: '640px',
  };
  rotateMarks: NzMarks = {
    0: '0deg',
    90: '90deg',
    180: '180deg',
    360: '360deg',
  };
  scaleMarks: NzMarks = {
    0.5: '0.5x',
    1: '1.0x',
    2: '2.0x',
    3: '3.0x',
  };
}
