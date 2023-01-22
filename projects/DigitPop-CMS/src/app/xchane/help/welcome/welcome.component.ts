import {
  AfterViewInit, Component, ElementRef, OnInit, ViewChild
} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Project} from '../../../shared/models/project';
import {
  XchaneAuthenticationService
} from '../../../shared/services/xchane-auth-service.service';

@Component({
  selector: 'digit-pop-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})

export class WelcomeComponent implements OnInit, AfterViewInit {
  project: Project;
  videoUrl: string;
  closeSection = false;
  closeClass = '';
  soundIcon = 'muted';
  @ViewChild('welcomeAnchor') welcomeAnchor: ElementRef;
  @ViewChild('welcomeVideo') welcomeVideo: ElementRef;
  @ViewChild('replayButton') replayButton: ElementRef;

  constructor(private dialog: MatDialog, private xchaneAuthService: XchaneAuthenticationService) {
    const videoPath = 'v1644701022/DigitPop-1080p-220208_n2xy7t.mp4';

    this.videoUrl = `https://res.cloudinary.com/boggssystems/video/upload/${videoPath}`;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.welcomeVideo.nativeElement.muted = true;
    this.replayVideo();
  }

  toggleSound = () => {
    this.welcomeVideo.nativeElement.muted = !this.welcomeVideo.nativeElement.muted;

    this.soundIcon = this.welcomeVideo.nativeElement.muted ? 'muted' : 'unmuted';
  }

  replayVideo = () => {
    this.welcomeVideo.nativeElement.pause();
    this.welcomeVideo.nativeElement.currentTime = 0;
    this.welcomeVideo.nativeElement.play();
  }

  wrapSection = () => {
    this.welcomeVideo.nativeElement.pause();
    this.closeClass = 'wrap';

    this.updateUser();
    setTimeout(() => this.closeSection = true, 500);
  }

  collapseSection = () => {
    this.welcomeVideo.nativeElement.pause();
    this.closeSection = true;
    this.closeClass = 'wrap';
  }

  openSection = () => {
    this.closeSection = false;
    this.closeClass = '';
  }

  scrollToVideo = () => {
    this.welcomeVideo.nativeElement.pause();
    this.closeSection = true;

    this.welcomeAnchor.nativeElement.scrollIntoView({
      behavior: 'smooth'
    });
  }

  updateUser = () => {
    this.xchaneAuthService.welcome().subscribe((res) => {
      this.xchaneAuthService.currentUserValue.welcomed = true;
    }, (error) => {
      console.error(error);
    });
  }
}
