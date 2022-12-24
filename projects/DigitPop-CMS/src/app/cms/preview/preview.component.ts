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
  campaignId: string | boolean;

  constructor(public dialogRef: MatDialogRef<PreviewComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.iFrameSrc = `${environment.playerUrl}/ad/` + data.id + '/preview/true';
    this.campaignId = data.campaignId ? data.campaignId : false;
    addEventListener('message', (event) => {
      this.respondToMessage(event.origin);
    });
  }

  ngOnInit(): void {
  }

  respondToMessage(targetOrigin = '*') {
    const iframe = document.querySelector('iframe.iframe') as HTMLIFrameElement;
    iframe.contentWindow.postMessage({campaignId: this.campaignId}, targetOrigin);
  }
}
