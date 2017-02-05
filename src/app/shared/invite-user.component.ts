import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthService } from '../security/auth.service';
@Component({
    selector: 'invite-user',
    template: `
    
    <i class="fa fa-user-plus fa-5 pull-right" aria-hidden="true" style="cursor:pointer" (click)="modal.open('sm')"></i>
<modal #modal>
    <modal-header [show-close]="true">
        <h4 class="modal-title">Invite User</h4>
    </modal-header>
    <modal-body>
        <div class="form-group">
                <label for="name">Name</label>
                <input type="text" class="form-control" required [(ngModel)]="name" name="name" id="name">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="text" class="form-control" required [(ngModel)]="email" name="email" id="email">
            </div>
    </modal-body>
    <modal-footer [show-default-buttons]="false">
          <span class="pull-right">
                <button class="btn btn-warning" (click)="cancel()">Cancel</button>
                <button class="btn btn-primary" (click)="submit()">
                   Submit
                </button>
            </span>   
    </modal-footer>
</modal>
    `
})
export class InviteUserComponent {
    private name:string = null;
    private email: string = null;
    private friendsInvitationRef: FirebaseListObservable<any[]> = null;

    @ViewChild('modal')
    modal: ModalComponent;
    constructor(private af: AngularFire, private auth: AuthService) {
        this.friendsInvitationRef = af.database.list('invitations');
    }

    cancel() {
        this.modal.dismiss();
    }
    submit() {
        let user = {
            "Email" : this.email,
            "Name": this.name,
            "From": this.auth.displayName
        }
        console.log("name, email:",this.name, this.email )
        this.friendsInvitationRef.push(user).then((result)=>{
            this.email = '';
            this.name = '';
        })
    }
}