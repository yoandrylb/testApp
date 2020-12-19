import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../services/api.service';
import {GlobalService} from '../services/global.service';
import {Router} from '@angular/router';
import {LoadingController} from '@ionic/angular';

@Component({
    selector: 'app-register',
    templateUrl: './register.page.html',
    styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

    registerForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private loadingCtrl: LoadingController,
        private api: ApiService,
        private global: GlobalService,
        private router: Router,
    ) {
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            password: ['', Validators.required],
        });
    }

    OnSubmit() {
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
            this.api.register(this.registerForm.value).subscribe(
                (resData: any) => {
                    loadingEl.dismiss();
                    this.global.presentOkAlert('¡Good!', '', 'Login to your account');
                    this.router.navigate(['/login']);
                },
                errRes => {
                    console.log('Error' + JSON.stringify(errRes));
                    loadingEl.dismiss();
                    this.global.presentOkAlert('¡Ups!', '', '');

                }
            );
        });
    }

    register() {
        this.router.navigate(['/register']);
    }

}
