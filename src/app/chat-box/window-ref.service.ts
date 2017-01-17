import { Injectable, Inject } from '@angular/core';
import { Subject} from 'rxjs/Rx';

@Injectable()
export class WindowRefService {
    public isActive = new Subject<boolean>();
    public hasFocus = false;
    constructor(@Inject("windowObject") window: Window) { 
        var self = this;
        window.addEventListener('focus', (ev)=>{
            this.isActive.next(true);
            this.hasFocus = true;
        })
        window.addEventListener('blur', (ev) => {
            this.isActive.next(false);
            this.hasFocus = false;
        });
    }
}