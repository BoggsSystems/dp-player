'use strict';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {VideosGridService} from '../shared/services/videos-grid.service';
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

  constructor(private videosService: VideosGridService) {
  }

  ngOnInit(): void {
    this.getCategories();
  }

  buildGrid: () => void = async () => {
    this.secondsToMMSS(this.videos);
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

  secondsToMMSS = (videos: ProjectMedia[]) => {
    const padWithZero = (time: number) => time.toString().padStart(2, '0');
    const timestamp = (seconds: number) => {
      const minutes = (seconds - (seconds % 60)) / 60;
      const remainingSeconds = Math.round(seconds % 60);
      return `${padWithZero(minutes)}:${padWithZero(remainingSeconds)}`;
    };
    videos.map(video => {
      video.media.duration = timestamp(+video.media.duration);
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

}
