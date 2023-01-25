import {Component, Inject, OnInit} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef
} from '@angular/material/dialog';

@Component({
  selector: 'digit-pop-redemptionpopup',
  templateUrl: './redemptionpopup.component.html',
  styleUrls: ['./redemptionpopup.component.scss']
})

export class RedemptionpopupComponent implements OnInit {
  redemptionDialog: MatDialog;
  title: string;
  message: string;

  // tslint:disable-next-line:max-line-length
  constructor(private dialogRef: MatDialogRef<RedemptionpopupComponent>, public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.redemptionDialog = dialog;
  }

  ngOnInit() {
  }
}
