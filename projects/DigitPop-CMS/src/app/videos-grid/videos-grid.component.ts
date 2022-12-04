'use strict';
import {Component, OnInit} from '@angular/core';
import {VideosGridService} from '../shared/services/videos-grid.service';
import {ProjectMedia} from '../shared/models/ProjectMedia';

@Component({
  selector: 'digit-pop-videos-grid',
  templateUrl: './videos-grid.component.html',
  styleUrls: ['./videos-grid.component.scss']
})

export class VideosGridComponent implements OnInit {

  categories: string[] = [];
  videos: ProjectMedia[] = [];

  constructor(private videosService: VideosGridService) {
    this.categories.push('Clothing', 'Golf');
  }

  ngOnInit(): void {
    this.getVideos();
  }

  buildGrid: () => void = async () => {
    console.log(this.videos);
  }

  getVideos: () => void = async () => {
    return this.videosService
      .getVideos(this.categories)
      .subscribe(
        (response) => {
          this.videos = response;
          this.buildGrid();
        },
        (error: Error) => {
          console.error(error);
        }
      );
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
