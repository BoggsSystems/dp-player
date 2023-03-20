import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Campaign} from '../models/campaign';
import {MatDialog} from '@angular/material/dialog';
import {EngagementService} from '../shared/services/engagement.service';
import {CampaignService} from '../shared/services/campaign.service';
import {CrossDomainMessaging} from '../shared/helpers/cd-messaging';
import {environment} from '../../environments/environment';
import {WebsocketService} from '../shared/services/websocket.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  providers: [WebsocketService]
})

export class QuizComponent implements OnInit, AfterViewInit, AfterViewChecked {
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
  isUser: boolean;

  // tslint:disable-next-line:max-line-length
  constructor(private route: ActivatedRoute, private campaignService: CampaignService, public dialog: MatDialog, private engagementService: EngagementService, private router: Router, private webSocket: WebsocketService) {
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

    if (navState.isUser && navState.campaignId != null) {
      this.engagementId = navState.engagementId;
      this.campaignId = nav.extras.state.campaignId;
      this.getCampaign(this.campaignId);
    }

    this.isUser = navState.isUser;

    if (navState.messagingOrigin != null) {
      this.messagingOrigin = nav.extras.state.messagingOrigin;
    }
  }

  ngOnInit(): void {
    console.log("In ngOnInit, homeUrl is : " + environment.homeUrl);
    console.log("In ngOnInit, iOSFallbackUrl is : " + environment.iOSFallbackUrl);
    const targetWindow = window.parent;
    addEventListener('message', this.initCommunications.bind(this), false);
  }

  initCommunications(event: any) {
    if (event.data != null && event.data.initCommunications) {
      this.detectIos = false;
    }
  }

  ngAfterViewInit() {
    console.log("In ngAfterViewInit, this.detectIos is : " + this.detectIos);

    if (this.detectIos) {
      this.isIOS = CrossDomainMessaging.isIOS();
      console.log("In ngAfterViewInit, this.isIOS is : " + this.isIOS);

      if (this.isIOS) {
        this.isSafari = CrossDomainMessaging.isSafari();
        this.iOSVersion = CrossDomainMessaging.getVersion();

        console.log("In ngAfterViewInit, this.isSafari is : " + this.isSafari);
        console.log("In ngAfterViewInit, this.iOSVersion is : " + this.iOSVersion);
      }
    }

    const targetWindow = window.parent;

    if (!this.isIOS) {
      console.log("In ngAfterViewInit, !this.isIOS so sending message to : " + environment.homeUrl);
      return targetWindow.postMessage({received: true}, environment.homeUrl);
      // return targetWindow.postMessage(res, 'http://localhost:4200');
    }
    else {
      console.log("In ngAfterViewInit, this.isIOS == true so sending message to : " + environment.iOSFallbackUrl);
      return targetWindow.postMessage({received: true}, environment.iOSFallbackUrl);
      // return targetWindow.postMessage(res, 'http://localhost:4200');
    }
  }

  ngAfterViewChecked() {
    this.webSocket.messages.subscribe(message => {
      console.log(message);
    });
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
    return this.engagementService
      .verificationAnswer(answer, this.engagementId, this.campaignId, this.isUser)
      .subscribe((res: any) => {
        res = {action: 'postQuiz', isUser: this.isUser, isCorrect: res};

        const targetWindow = window.parent;
        // TODO: Replace localhost with production urls
        if (!this.detectIos) {
          return targetWindow.postMessage(res, this.messagingOrigin);
          // return targetWindow.postMessage(res, 'http://localhost:4200');
        }
        if (this.isIOS) {
          return targetWindow.postMessage(res, environment.iOSFallbackUrl);
          // return targetWindow.postMessage(res, 'http://localhost:4200');
        }
        return targetWindow.postMessage(res, environment.homeUrl);
        // return targetWindow.postMessage(res, 'http://localhost:4200');
      }, (err: any) => {
        console.error(err);
      });
  }
}
