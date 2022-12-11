import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {environment} from 'projects/DigitPop-CMS/src/environments/environment';

@Component({
  selector: 'digit-pop-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
})
export class PreviewComponent implements OnInit {
  iFrameSrc: any;

  constructor(public dialogRef: MatDialogRef<PreviewComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    const source = `${environment.playerUrl}/ad/` + data.id + '/preview/true';
    this.iFrameSrc = source;
  }

  ngOnInit(): void {
    // this.autoPlay();
  }

  autoPlay(): void {
    console.log(this.iFrameSrc);
  }
}
