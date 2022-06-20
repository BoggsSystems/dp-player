import { Component, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Project } from '../../../shared/models/project';

@Component({
  selector: 'DigitPop-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  project:Project;
  videoUrl:string;

  constructor(private dialog: MatDialog) {

    this.videoUrl = "https://res.cloudinary.com/boggssystems/video/upload/v1644701022/DigitPop-1080p-220208_n2xy7t.mp4";

   }

  ngOnInit(): void {
  }


}
