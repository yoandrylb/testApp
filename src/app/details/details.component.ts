import {Component, Input, OnInit} from '@angular/core';
import {Mrz} from '../models/Mrz';
import {ModalController} from '@ionic/angular';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit {
    @Input() verification: Mrz;
    profileImg;

    constructor(
        private modalCtrl: ModalController,
        private sanitizer: DomSanitizer,
    ) {
    }

    ngOnInit() {
        if (this.verification.face_image !== 'false') {
            // tslint:disable-next-line:max-line-length
            this.profileImg = (this.sanitizer.bypassSecurityTrustResourceUrl(this.verification.face_image) as any).changingThisBreaksApplicationSecurity;
        } else {
            this.profileImg = 'assets/images/b-cart.svg';
        }
    }

    close() {
        // using the injected ModalController this page
        // can "dismiss" itself and optionally pass back data
        this.modalCtrl.dismiss();
    }

}
