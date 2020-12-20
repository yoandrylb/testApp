import {Component} from '@angular/core';
import {ActionSheetController, LoadingController, ModalController} from '@ionic/angular';
import {
    Plugins, CameraResultType, Capacitor, FilesystemDirectory,
    CameraPhoto, CameraSource, CameraOptions
} from '@capacitor/core';
import {ApiService} from '../services/api.service';
import {User} from '../models/User';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {DetailsComponent} from '../details/details.component';
import {Mrz} from '../models/Mrz';
import {GlobalService} from '../services/global.service';
import {DomSanitizer} from '@angular/platform-browser';

const {Camera, Filesystem, Storage, CameraOptions} = Plugins;

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
})
export class HomePage {

    imgData: any = '';
    imageUri: any;
    status = 0;
    color = 'danger';
    user: User;
    profileSubscription: Subscription;
    profileImg;

    constructor(
        private actionSheetCtrl: ActionSheetController,
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
        private api: ApiService,
        private global: GlobalService,
        private router: Router,
        private sanitizer: DomSanitizer,
    ) {
    }

    ionViewWillEnter() {
        this.profileSubscription = this.api.profile().subscribe((data: any) => {
            this.user = data;
            if (this.user.frontId) {
                // tslint:disable-next-line:max-line-length
                this.profileImg = (this.sanitizer.bypassSecurityTrustResourceUrl(this.user.frontId.face_image) as any).changingThisBreaksApplicationSecurity;
            }
        });
    }

    async changeProfileOption(option: number) {
        const actionSheet = await this.actionSheetCtrl.create({
            header: 'Select method',
            buttons: [
                {
                    text: 'Camera',
                    role: 'destructive',
                    icon: 'camera-outline',
                    handler: () => {
                        const cameraOptions = {
                            resultType: CameraResultType.Base64,
                            width: 800,
                            height: 600,
                            preserveAspectRatio: true,
                            source: CameraSource.Camera,
                            quality: 70
                        };
                        this.getPhoto(cameraOptions, option);
                    },
                },
                {
                    text: 'Gallery',
                    icon: 'image-outline',
                    handler: () => {
                        const cameraOptions = {
                            resultType: CameraResultType.Base64,
                            width: 800,
                            height: 600,
                            preserveAspectRatio: true,
                            source: CameraSource.Photos,
                            quality: 70
                        };
                        this.getPhoto(cameraOptions, option);
                    },
                },
                {
                    text: 'Cancel',
                    icon: 'close',
                    handler: () => {
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    getPhoto(cameraOptions, option: number) {
        Camera.getPhoto(cameraOptions).then(
            (fileUri) => {
                const imgData = 'data:image/jpg;base64,' + fileUri.base64String;
                this.loadingCtrl.create({
                    backdropDismiss: false,
                    keyboardClose: true,
                    cssClass: 'custom-loader',
                    message: `<div class="kyc-spinner">
                              <div class="kyc-spinner-dot"></div>
                              <div class="kyc-spinner-dot"></div>
                              <div class="kyc-spinner-dot"></div>
                              <div class="kyc-spinner-dot"></div>
                              <div class="kyc-spinner-dot"></div>
                              <div class="kyc-spinner-dot"></div>
                          </div>`,
                    spinner: null,
                }).then(loadingEl => {
                    loadingEl.present();
                    this.api.VerifyId(fileUri.base64String, option)
                        .subscribe((res: any) => {
                                loadingEl.dismiss();
                                if (res.Status === 'Success') {
                                    if (option === 1) {
                                        this.user.frontId = res.data.MRZdata;
                                        this.profileImg = (this.sanitizer.bypassSecurityTrustResourceUrl(this.user.frontId.face_image) as any).changingThisBreaksApplicationSecurity;
                                        this.user.frontImg = 'data:image/jpg;base64,' + fileUri.base64String;
                                    } else {
                                        this.user.backImg = 'data:image/jpg;base64,' + fileUri.base64String;
                                        this.user.backId = res.data.MRZdata;
                                    }
                                } else {
                                    this.global.presentOkAlert('Error', '', res.Message);
                                }
                            }, error => {
                                loadingEl.dismiss();
                                this.global.presentOkAlert('Error', '', 'Server Error');
                            }
                        );
                });
            },
            (err) => {
            }
        );
    }

    logout() {
        this.profileSubscription.unsubscribe();
        this.api.token = '';
        this.router.navigate(['/login']);
    }

    async showDetails(mrz: Mrz) {

        const modal = await this.modalCtrl.create({
            component: DetailsComponent,
            cssClass: 'my-custom-class',
            componentProps: {
                verification: mrz
            }
        });
        await modal.present();
    }
}
