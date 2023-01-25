import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'digit-pop-confirm-dialog',
  templateUrl: './answer-dialog.component.html',
  styleUrls: ['./answer-dialog.component.scss']
})
export class AnswerDialogComponent implements OnInit {
  title: string;
  message: string;

  constructor(public dialogRef: MatDialogRef<AnswerDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }
}
