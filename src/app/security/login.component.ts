import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
    selector: 'login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {
    constructor(private af:AngularFire) { }

    login() {
        
    this.af.auth.login().then(x=>{
    }).catch(e =>{
      alert(e.message);
    });
  }
    ngOnInit() { }
}