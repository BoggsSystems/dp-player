'use strict';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {VideosGridService} from '../shared/services/videos-grid.service';
import {PreviewComponent} from '../cms/preview/preview.component';
import {ProjectMedia} from '../shared/models/ProjectMedia';
import {Category} from '../shared/models/category';

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
  videos: ProjectMedia[] = [];
  videosLoaded = false;
  videosLimit = 10;
  videosCount: number[];
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private videosService: VideosGridService, private dialog: MatDialog) {
    this.videosCount = Array(this.videosLimit).fill(0).map((x, i) => i);
  }

  ngOnInit(): void {
    this.getCategories();
  }

  buildGrid: () => void = async () => {
    this.videosLoaded = true;
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
    this.getVideos();
  }

  getVideos: () => void = async () => {
    return this.videosService
      .getVideos(this.selectedCategories)
      .subscribe((response) => {
        this.videos = response;
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

  openPlayer = (event: Event, id: string) => {
    event.preventDefault();
    const dialogConfig = new MatDialogConfig();

    dialogConfig.data = {id};
    const dialogRef = this.dialog.open(PreviewComponent, dialogConfig);
  }

  prettyDate = (d: Date) => {
    const date = new Date(d);
    return `${this.monthNames[date.getMonth()]}, ${date.getDate()} - ${date.getFullYear()}`;

  }
}
