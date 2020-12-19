import {Mrz} from './Mrz';

export class User {

    id: string;
    name: string;
    email: string;
    password: string;
    frontImg: string;
    backImg: string;
    frontId: Mrz;
    backId: Mrz;

    constructor() {
    }
}
