import { Injectable } from '@angular/core';
@Injectable()
export class TitleService {
    private counter: number = 0;
    private title: string = '';
    private mTimeInterval = null;

    constructor() {
    }
    public setTitle(txt: string): TitleService {
        this.title = txt;
        this.counter = 0;
        return this;
    }
    public marquee() {
        this.mTimeInterval = setInterval(() => {
            if(this.title) {
                document.title = this.title.substring(this.counter, this.title.length) + " " + this.title.substring(0, this.counter);
         
            this.counter++;

            if (this.counter > this.title.length) {
                this.counter = 0;
            }
        }
        }, 200);
    }

    public Off() {
        this.title = 'devFireChat';
        document.title = this.title;
        if (this.mTimeInterval) {
            clearInterval(this.mTimeInterval);
        }
    }
}