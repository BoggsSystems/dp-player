'use strict';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VideosGridService} from '../shared/services/videos-grid.service';
import {EngagementService} from '../shared/services/engagement.service';
import {PreviewComponent} from '../cms/preview/preview.component';
import {ProjectMedia} from '../shared/models/ProjectMedia';
import {Category} from '../shared/models/category';
import {environment} from '../../environments/environment';
import {PlayerComponent} from '../xchane/player/player.component';
import {OkDialogComponent} from '../cms/ok-dialog/ok-dialog.component';
import {
  throwError as observableThrowError
} from 'rxjs/internal/observable/throwError';

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
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private videosService: VideosGridService, private engagementService: EngagementService, private dialog: MatDialog) {
    this.videosCount = Array(this.videosLimit).fill(0).map((x, i) => i);
    this.categoryVideosCount = 0;
  }

  ngOnInit(): void {
    this.getCategories();
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
    return this.videosService
      .getVideos(this.selectedCategories, this.page, this.videosLimit)
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

  openPlayer = (event: Event, id: string, campaignId: string) => {
    // this.engagementService
    //   .createEngagement(this.authService.currentUserValue, category)
    //   .subscribe((data: any) => {
    //     // REFACTOR WITH NEW PLAYER
    //     this.iFrameSrc = `${environment.playerUrl}/ad/` + data.project + '/engagement/' + data._id + '/campaign/' + data.campaign;
    //
    //     // Store current campaign?  May need if there is a retry
    //
    //     this.popupDialogRef = this.dialog.open(PlayerComponent, {
    //       autoFocus: true, hasBackdrop: true, closeOnNavigation: false,
    //     });
    //     this.popupDialogRef.componentInstance.iFrameSrc = this.iFrameSrc;
    //
    //     console.log('iFrameSrc :' + this.iFrameSrc);
    //     return true;
    //   }, (error: any) => {
    //     const confirmDialog = this.dialog.open(OkDialogComponent, {
    //       data: {
    //         title: 'No ads currently available',
    //         message: 'There are no additional ads at the moment. Try back later.',
    //       },
    //     });
    //     return observableThrowError(error);
    //   });

    // this.engagementService.createEngagement()

    event.preventDefault();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {id, campaignId, isUser: false};
    const dialogRef = this.dialog.open(PreviewComponent, dialogConfig);
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
}
