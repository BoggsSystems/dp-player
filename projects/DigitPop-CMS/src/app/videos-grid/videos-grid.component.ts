'use strict';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef
} from '@angular/material/dialog';
import {VideosGridService} from '../shared/services/videos-grid.service';
import {EngagementService} from '../shared/services/engagement.service';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {PreviewComponent} from '../cms/preview/preview.component';
import {ProjectMedia} from '../shared/models/ProjectMedia';
import {Category} from '../shared/models/category';
import {
  AnswerDialogComponent
} from '../xchane/answer-dialog/answer-dialog.component';
import {PlayerComponent} from '../xchane/player/player.component';
import {timer} from 'rxjs';
import {VisitorPopupComponent} from '../visitor-popup/visitor-popup.component';
import {XchaneUser} from '../shared/models/xchane.user';

@Component({
  selector: 'digit-pop-videos-grid',
  templateUrl: './videos-grid.component.html',
  styleUrls: ['./videos-grid.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class VideosGridComponent implements OnInit {
  selectedCategories: string[] = [];
  categories: string[] = [];
  activeCategories: Category[] = [];
  categoryVideosCount: number;
  videos: ProjectMedia[] = [];
  videosLoaded = false;
  MoreVideosLoaded = false;
  videosLimit = 10;
  videosCount: number[];
  page = 0;
  projectId: string;
  campaignId: string;
  categoryId: string;
  popupDialogRef: MatDialogRef<PlayerComponent>;
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  scoreBubbleIsOpen: boolean;
  canToggle: boolean;
  completedShoppableTour = false;

  // tslint:disable-next-line:max-line-length
  constructor(private videosService: VideosGridService, private engagementService: EngagementService, private authService: XchaneAuthenticationService, private dialog: MatDialog) {
    this.scoreBubbleIsOpen = false;
    this.canToggle = false;
    this.videosCount = Array(this.videosLimit).fill(0).map((x, i) => i);
    this.categoryVideosCount = 0;
  }

  ngOnInit(): void {
    if (this.authService.currentUserValue) {
      this.completedShoppableTour = this.authService.currentUserValue.toured ? this.authService.currentUserValue.toured : false;
      localStorage.setItem('completedShoppableTour', String(this.completedShoppableTour));
    } else if (localStorage.getItem('completedShoppableTour')) {
      this.completedShoppableTour = localStorage.getItem('completedShoppableTour') === 'true';
    } else {
      localStorage.setItem('completedShoppableTour', 'false');
    }
    this.getCategories();
    window.addEventListener('message', this.handlePostQuizMessage.bind(this), false);
  }

  buildGrid: () => void = async () => {
    this.videosLoaded = true;
    this.MoreVideosLoaded = true;
  }

  getCategories: () => void = () => {
    return this.videosService
      .getActiveCategories()
      .subscribe((response: Category[]) => {
        this.activeCategories = response;
        this.categories = this.selectedCategories = this.activeCategories.map(category => category.name);
        this.getVideos();
      });
  }

  setCategory: (category: string) => void = (category: string) => {
    this.selectedCategories = category === 'All' ? this.categories : [category];
    this.page = 0;
    this.getVideos();
  }

  getVideos: (isAppend?: boolean) => void = async (isAppend: boolean = false) => {
    const currentUserId = localStorage.getItem('XchaneCurrentUser')
      ? JSON.parse(localStorage.getItem('XchaneCurrentUser'))._id
      : false;

    return this.videosService
      .getVideos(this.selectedCategories, this.page, this.videosLimit, currentUserId)
      .subscribe((response) => {
        this.categoryVideosCount = response[0].count;
        this.videos = isAppend ? [...this.videos, ...response] : response;
        this.buildGrid();
      }, (error: Error) => {
        console.error(error);
      });
  }

  previewVideo = (event: Event) => {
    const thumbnail = event.target as Element;
    const video = thumbnail.querySelector('video') as HTMLVideoElement;

    video.muted = true;
    video.loop = true;
    video.currentTime = 1;

    video.play().then(() => {
      thumbnail.addEventListener('mouseleave', () => this.stopPreview(thumbnail, video));
    });
  }

  stopPreview = (thumbnail: Element, video: HTMLVideoElement) => {
    thumbnail.removeEventListener('mouseleave', () => this);
    video.load();
  }

  openPlayer = (id: string, campaignId: string, categoryId: string, event: Event | null = null) => {
    if (event) {
      event.preventDefault();
    }

    this.projectId = id;
    this.campaignId = campaignId;
    this.categoryId = categoryId;

    const dialogConfig = new MatDialogConfig();
    const isUser = !!localStorage.getItem('XchaneCurrentUser');
    const userId = isUser ? JSON.parse(localStorage.getItem('XchaneCurrentUser'))._id : false;

    // if (isUser) {
    //   const user = localStorage.getItem('XchaneCurrentUser');

    //
    //   this.engagementService
    //     .createEngagement(JSON.parse(user), category)
    //     .subscribe(
    //       (data: any) => {
    //         this.popupDialogRef.componentInstance.iFrameSrc = `${environment.playerUrl}/ad/` +
    //           id +
    //           '/engagement/' +
    //           data._id +
    //           '/campaign/' +
    //           campaignId;
    //         return true;
    //       }
    //     );
    // } else {
    //
    // }
    let engagementId;
    if (isUser) {
      const category = {
        _id: this.categoryId,
        name: '',
        description: '',
      };
      this.engagementService
        .createEngagement(this.authService.currentUserValue, category)
        .subscribe(
          (data: any) => {
            return engagementId = data._id;
          }
        );
    }
    dialogConfig.data = {
      id,
      campaignId,
      userId,
      categoryId,
      engagementId,
      completedShoppableTour: this.completedShoppableTour
    };
    this.popupDialogRef = this.dialog.open(PreviewComponent, dialogConfig);

  }

  loadMoreVideos = () => {
    this.videosCount = Array(this.categoryVideosCount - ((this.page + 1) * this.videosLimit)).fill(0).map((x, i) => i);
    this.MoreVideosLoaded = false;
    this.page++;
    this.getVideos(true);
  }

  prettyDate = (d: Date) => {
    const date = new Date(d);
    return `${this.monthNames[date.getMonth()]}, ${date.getDate()} - ${date.getFullYear()}`;
  }

  handlePostQuizMessage = (event: any) => {
    if (event.data.action === 'postQuiz') {
      this.popupDialogRef.close();

      const isCorrect = event.data.isCorrect;
      let confirmDialog: any;

      if (!isCorrect) {
        confirmDialog = this.dialog.open(AnswerDialogComponent, {
          data: {
            title: 'Incorrect Answer',
            message: 'Incorrect Answer, would you like to try again?',
          },
        });

        return confirmDialog.afterClosed().subscribe((result: boolean) => {
          confirmDialog.close();

          if (result === true) {
            this.openPlayer(this.projectId, this.campaignId, this.categoryId);
          }
        });
      }

      this.canToggle = true;
      this.scoreBubbleToggle(event.data.isUser);
      this.canToggle = false;
    } else if (event.data.action === 'completedShoppableTour') {
      this.completedShoppableTour = event.data.completed;
      localStorage.setItem('completedShoppableTour', event.data.completed);
      if (this.completedShoppableTour) {
        this.toured();
      }
    }
  }

  scoreBubbleToggle = (isUser: boolean) => {
    if (this.canToggle) {
      this.scoreBubbleIsOpen = !this.scoreBubbleIsOpen;

      if (this.scoreBubbleIsOpen) {
        const scoreBubbleTimer = timer(2000);
        scoreBubbleTimer.subscribe((x: any) => {
          this.scoreBubbleIsOpen = !this.scoreBubbleIsOpen;
          if (!isUser) {
            this.openVisitorPopup();
          }
        });
      }
    }
  }

  openVisitorPopup = () => {
    const dialogRef = this.dialog.open(VisitorPopupComponent, {
      data: {
        campaignId: this.campaignId,
        projectId: this.projectId
      },
      panelClass: 'dpop-modal'
    });

    dialogRef.afterClosed().subscribe(() => {
    });
  }

  toured = () => {
    if (!this.authService.currentUserValue.toured) {
      this.authService
        .tour()
        .subscribe(
          (res: XchaneUser) => {
            if (res.toured) {
              this.authService.storeUser(res);
            }
          },
          (error: any) => {
            console.error(error);
          }
        );
    }
  }
}
