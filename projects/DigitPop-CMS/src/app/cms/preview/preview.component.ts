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
  categoryId: string | boolean;
  completedShoppableTour: boolean;

  constructor(public dialogRef: MatDialogRef<PreviewComponent>, @Inject(MAT_DIALOG_DATA) data: any) {
    this.iFrameSrc = `${environment.playerUrl}/ad/${data.id}/preview/true/userId/${data.userId !== false ? data.userId : 'false'}`;
    this.campaignId = data.campaignId ? data.campaignId : false;
    this.categoryId = data.categoryId ? data.categoryId : false;
    this.completedShoppableTour = data.completedShoppableTour ? data.completedShoppableTour : false;
    addEventListener('message', (event) => {
      this.sendMessage(event.origin);
    });
  }

  ngOnInit(): void {
  }

  sendMessage = (targetOrigin: string = '*', message: any = {
    campaignId: this.campaignId,
    categoryId: this.categoryId,
    toured: this.completedShoppableTour
  }) => {
    const iframe = document.querySelector('iframe.iframe') as HTMLIFrameElement;
    iframe.contentWindow.postMessage(message, targetOrigin);
  }
}
