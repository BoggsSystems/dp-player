import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'digit-pop-failure-popup',
  templateUrl: './failure-popup.component.html',
  styleUrls: ['./failure-popup.component.scss']
})

export class FailurepopupComponent implements OnInit {
  failureDialog: MatDialog;

  constructor(private dialogRef: MatDialogRef<FailurepopupComponent>, public dialog: MatDialog) {
    this.failureDialog = dialog;
  }

  ngOnInit() {
  }
}
