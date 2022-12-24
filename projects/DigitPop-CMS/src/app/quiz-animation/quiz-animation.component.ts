import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'digit-pop-quiz-animation',
  templateUrl: './quiz-animation.component.html',
  styleUrls: ['./quiz-animation.component.scss']
})
export class QuizAnimationComponent implements OnInit {

  @Input()
  scoreBubbleIsOpen: boolean;

  constructor() {
  }

  ngOnInit(): void {
  }

}
