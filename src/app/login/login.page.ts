import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {GlobalService} from '../services/global.service';
import {Router} from '@angular/router';
import {LoadingController, NavController} from '@ionic/angular';

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    loginForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private loadingCtrl: LoadingController,
        private navCtrl: NavController,
        private api: ApiService,
        private global: GlobalService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            password: ['', Validators.required]
        });
    }

    OnSubmit() {
        const controls = this.loginForm.controls;
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
            this.api.login(controls.email.value, controls.password.value).subscribe(
                (resData: any) => {
                    loadingEl.dismiss();
                    this.api.token = resData.token;
                    this.api.expiresAfter = resData.expires_in;
                    setTimeout(() => {

                        this.navCtrl.navigateRoot('/home');
                    }, 100);
                },
                errRes => {
                    console.log('error' + JSON.stringify(errRes));
                    loadingEl.dismiss();
                    this.global.presentOkAlert('¡Ups!', '', 'These credentials do not match our records');

                }
            );
        });
    }

    register() {
        this.router.navigate(['/register']);
    }

}
