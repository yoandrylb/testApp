import {Injectable} from '@angular/core';
import {AlertController} from '@ionic/angular';
import {LoadingController} from '@ionic/angular';
import {User} from '../models/User';

@Injectable({
    providedIn: 'root'
})
export class GlobalService {

    isRegistered = false;
    currentUser: User = null;

    loading: any;

    token = '';
    expiresAfter = '';

    constructor(
        public alertController: AlertController,
        public loadingController: LoadingController
    ) {
        console.log('GlobalService...');
    }

    public async showLoading() {
        this.loading = await this.loadingController.create({
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
        });
        await this.loading.present();
    }

    public async hideLoading() {
        if (this.loading !== null) {
            await this.loading.dismiss();
            this.loading = null;
        }
    }


    public presentOkAlert(header: string, subHeader: string, message: string) {
        this.alertController.create({
            header,
            subHeader,
            message,
            buttons: ['OK']
        }).then(res => {
            res.present();
        });
    }
}
