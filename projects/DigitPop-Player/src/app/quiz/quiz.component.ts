import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../models/campaign';
import {MatGridListModule} from '@angular/material/grid-list';
import {AnswerDialogComponent} from '../answer-dialog/answer-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {EngagementService} from '../shared/services/engagement.service';
import {CampaignService} from '../shared/services/campaign.service';
import {environment} from '../../environments/environment.staging';
import {CrossDomainMessaging} from '../shared/helpers/cd-messaging';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})

export class QuizComponent implements OnInit, AfterViewInit {
  campaign: Campaign;
  answers: any[];
  campaignId: any;
  engagementId: any;
  data: any;
  messagingOrigin: any;
  isIOS = false;
  isSafari = false;
  iOSVersion = 0;
  detectIos = true;

  constructor(private route: ActivatedRoute, private campaignService: CampaignService, public dialog: MatDialog, private engagementService: EngagementService, private router: Router) {
    // Logic to determine if we're editing an existing project or creating a new one
    const nav = this.router.getCurrentNavigation();
    const checkNav = nav != null && nav.extras != null && nav.extras.state != null;

    if (!checkNav) {
      return;
    }

    const navState = nav.extras.state;
    if (!navState.isUser && navState.campaignId) {
      this.campaignId = navState.campaignId;
      this.getCampaign(this.campaignId);
    }

    if (navState.isUser && navState.campaignId != null && navState.engagementId != null) {
      this.campaignId = nav.extras.state.campaignId;
      this.engagementId = nav.extras.state.engagementId;
      this.getCampaign(this.campaignId);
    }

    if (navState.messagingOrigin != null) {
      this.messagingOrigin = nav.extras.state.messagingOrigin;
    }
  }

  ngOnInit(): void {
    const targetWindow = window.parent;
    addEventListener('message', this.initCommunications.bind(this), false);
    return targetWindow.postMessage({received: true}, `http://localhost:4200`);
  }

  initCommunications(event: any) {
    if (event.data != null && event.data.initCommunications) {
      this.detectIos = false;
    }
  }

  ngAfterViewInit() {
    if (this.detectIos) {
      this.isIOS = CrossDomainMessaging.isIOS();
      if (this.isIOS) {
        this.isSafari = CrossDomainMessaging.isSafari();
        this.iOSVersion = CrossDomainMessaging.getVersion();
      }
    }
  }

  getCampaign(campaignId: string) {
    if (campaignId != null) {
      this.campaignService.getCampaign(campaignId).subscribe((res) => {
        this.campaign = res as Campaign;
        this.buildAnswerArray();
      }, (err) => {
        console.error('Error retrieving ad');
      });
    }
  }

  buildAnswerArray() {
    const answerBuffer = [];
    answerBuffer.push(this.campaign.verificationWrongAnswer1);
    answerBuffer.push(this.campaign.verificationWrongAnswer2);
    answerBuffer.push(this.campaign.verificationWrongAnswer3);
    answerBuffer.push(this.campaign.verificationWrongAnswer4);
    answerBuffer.push(this.campaign.verificationAnswer);
    this.answers = this.shuffle(answerBuffer);
  }

  shuffle(array: any) {
    let currentIndex = array.length;
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  onAnswer(answer: any) {
    this.engagementService
      .verificationAnswer(answer, this.engagementId, this.campaignId)
      .subscribe((res: any) => {
        const targetWindow = window.parent;
        if (!this.detectIos) {
          return targetWindow.postMessage(res, this.messagingOrigin);
        }
        if (this.isIOS && this.iOSVersion <= 14) {
          return targetWindow.postMessage(res, environment.iOSFallbackUrl);
        }
        return targetWindow.postMessage(res, environment.homeUrl);
      }, (err: any) => {
        console.error(err);
      });
  }
}
