import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Campaign } from '../models/campaign';
import { MatGridListModule } from '@angular/material/grid-list';
import { AnswerDialogComponent } from '../answer-dialog/answer-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { EngagementService } from '../shared/services/engagement.service';
import { CampaignService } from '../shared/services/campaign.service';
import { environment } from '../../environments/environment.staging';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
})
export class QuizComponent implements OnInit {
  campaign: Campaign;
  answers: any[];
  campaignId: any;
  engagementId: any;
  data: any;

  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
    public dialog: MatDialog,
    private engagementService: EngagementService,
    private router: Router
  ) {
    // Logic to determine if we're editing an existing project or creating a new one
    var nav = this.router.getCurrentNavigation();

    if (
      nav != null &&
      nav.extras != null &&
      nav.extras.state != null &&
      nav.extras.state.campaignId != null &&
      nav.extras.state.engagementId != null
    ) {
      this.campaignId = this.router.getCurrentNavigation().extras.state.campaignId;
      this.engagementId = this.router.getCurrentNavigation().extras.state.engagementId;

      this.getCampaign(this.campaignId);
    }

    // const navigation = this.router.getCurrentNavigation();
    // const state = navigation.extras.state as {campaignId: string};
    // this.campaignId = state.campaignId;
  }

  ngOnInit(): void {
    //this.getCampaign(this.campaignId);
    // this.route.data.subscribe((data) => {
    //   this.data = data;
    // });
    // this.route.params.subscribe((params) => {
    //   this.campaignId = params['id'];
    //   this.getCampaign(this.campaignId);
    // });
  }

  getCampaign(campaignId: string) {
    if (campaignId != null) {
      this.campaignService.getCampaign(campaignId).subscribe(
        (res) => {
          this.campaign = res as Campaign;
          this.buildAnswerArray();
        },
        (err) => {
          console.log('Error retrieving ad');
        }
      );
    }
  }

  buildAnswerArray() {
    var answerBuffer = [];
    answerBuffer.push(this.campaign.verificationWrongAnswer1);
    answerBuffer.push(this.campaign.verificationWrongAnswer2);
    answerBuffer.push(this.campaign.verificationWrongAnswer3);
    answerBuffer.push(this.campaign.verificationWrongAnswer4);
    answerBuffer.push(this.campaign.verificationAnswer);
    this.answers = this.shuffle(answerBuffer);
  }

  shuffle(array: any) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

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
    //if (answer == this.campaign.verificationAnswer) {
    this.engagementService
      .verificationAnswer(answer, this.engagementId, this.campaignId)
      .subscribe(
        (res) => {
          // Evaluate if the answer was correct


          console.log("In answer callback, homeUrl is : " + environment.homeUrl);
          var targetWindow = window.parent;
          targetWindow.postMessage(res, `${environment.homeUrl}`);

          // If correct then pass message to parent container
          // if (res.correct) {

          //     var targetWindow = window.parent;


          // } else {

          //    // If not correct then create new engagement and start again
          //    const confirmDialog = this.dialog.open(AnswerDialogComponent, {
          //     data: {
          //       title: 'Incorrect Answer',
          //       message: 'Incorrect Answer, do you want to try again?',
          //     },
          //   });

          //   confirmDialog.afterClosed().subscribe((result) => {
          //     if (result === true) {
          //     } else {
          //     }
          //   });

          // }

        },
        (err) => {
          console.log('Error retrieving ad');
        }
      );

    var answerObj = new Object();

    // answer.engagementId = $rootScope.uiConfig.engagementId;
    // answer.campaignId = $rootScope.uiConfig.campaignId;
    // answer.answer = $scope.campaign.verificationAnswer;
    // } else {
    //   var targetWindow = window.parent;
    //   alert('Incorrect Answer.  Tap screen to start again.');
    //   console.log('Incorrect Answer');
    // }
  }
}
