import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {AuthenticationService} from '../shared/services/auth-service.service';
import {ConfirmedValidator} from '../shared/helpers/confirmed.validator';
import {User} from '../shared/models/user';
import {Role} from '../shared/models/role';
import {XchaneUser} from '../shared/models/xchane.user';
import {
  throwError as observableThrowError
} from 'rxjs/internal/observable/throwError';

interface customWindow extends Window {
  billsbyData: any;
}

declare const window: customWindow;


@Component({
  selector: 'digit-pop-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  @Input() hideCloseButton = false;
  @Input() fromQuiz = false;
  @Input() campaignId: string;
  @Input() projectId: string;
  @Input() toured = false;

  signUpForm: FormGroup;
  submitted = false;
  isCheckedConsumer: boolean;
  isCheckedBusiness: boolean;
  validRole: any;

  constructor(public dialogRef: MatDialogRef<SignupComponent>, fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: XchaneAuthenticationService, private bizAuthService: AuthenticationService) {
    this.validRole = Role.Business;
    //  window['billsbyData'] = {
    //   email: "fake@eamil.net",
    //   fname: "fake"
    // };
    this.signUpForm = fb.group({
      email: ['', Validators.required],
      password: ['', [Validators.required]],
      confirm_password: ['', [Validators.required]],
    }, {
      validator: ConfirmedValidator('password', 'confirm_password'),
    });

  }

  get f() {
    return this.signUpForm.controls;
  }

//   OnChangec($event: any){
//     this.isCheckedConsumer= false;
//     this.isCheckedBusiness =false;
//     this.isCheckedConsumer =$event.source.checked;
//      console.log(this.isCheckedConsumer,this.isCheckedBusiness);
//      if(this.isCheckedConsumer=true){
//        this.validRole=Role.Consumer;
//      }
//     // MatCheckboxChange {checked,MatCheckbox}
//   }
//   OnChangeb($eventa: any){
//     this.isCheckedConsumer= false;
//     this.isCheckedBusiness =false;
//     this.isCheckedBusiness =$eventa.source.checked;
//     if(this.isCheckedBusiness=true){
//       this.validRole=Role.Business;
//     }
//     console.log(this.isCheckedBusiness,this.isCheckedConsumer);
//    // MatCheckboxChange {checked,MatCheckbox}
//  }

  onChange($event: any) {
    if ($event.source.value == "1") {
      this.signUpForm.controls['email'].enable();
      this.validRole = Role.Consumer;
    }
    if ($event.source.value == "2") {
      this.validRole = Role.Business;
      this.signUpForm.controls['email'].disable();
      // this.signUpForm.controls['password'].disable();
      // this.signUpForm.controls['confirm_password'].disable();
    }
    console.log(this.validRole);
  }

  submit() {
    if (this.fromQuiz) {
      const xchaneUser = new XchaneUser();
      return this.handleXchaneSignUp(xchaneUser);
    }

    const user = new User();
    user.email = this.signUpForm.controls.email.value;
    user.password = this.signUpForm.controls.password.value;

    this.bizAuthService.createUser(user).subscribe((res) => {
      if (res) {
        localStorage.setItem('currentRole', 'Business');
        this.dialogRef.close();
        this.router.navigate(['/cms/dashboard']);
      }
    }, (err) => {
      console.log('Update error : ' + err.toString());
    });
  }

  ngOnInit(): void {
  }

  handleXchaneSignUp = (user: XchaneUser) => {
    user.email = this.signUpForm.controls.email.value;
    user.password = this.signUpForm.controls.password.value;
    user.role = Role.Consumer;

    if (this.toured) {
      user.toured = this.toured;
    }

    this.authService
      .createXchaneUser(user)
      .subscribe(response => {
        this.dialogRef.close();
        this.authService.storeUser(response.user);
        localStorage.setItem('currentRole', 'customer');
        this.addPointsToUser(response.user._id);
      }, error => {
        return observableThrowError(error);
      });
  }

  addPointsToUser = (xchaneUserId: string) => {
    this.authService
      .addPointsAfterSignUp(this.campaignId, xchaneUserId, this.projectId)
      .subscribe(response => {
        this.authService.storeUser(response);
        return this.router.navigate(['/xchane/dashboard']);
      }, error => {
        return observableThrowError(error);
      });
  }


  // async callBillsby(): Promise<void> {
  //   let call = await this.homeComp.clicktrial();
  //   this.dialogRef.close();

  // }
  callBillsby() {
    // this.dialogRef.close();
    //this.homeComp.clicktrial();
  }

  // ngDoCheck(){
  //   window['billsbyData'] = {
  //     email: "fake@eamil.net"
  //   };
  // }
  ngOnDestroy(): void {
    const frame = document.getElementById('checkout-billsby-iframe');
    if (frame != null) {
      frame.parentNode.removeChild(frame);
    }

    const bg = document.getElementById('checkout-billsby-outer-background');
    if (bg != null) {
      bg.parentNode.removeChild(bg);
    }
  }
}
