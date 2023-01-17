import {Component, OnInit} from '@angular/core';
import {TooltipPosition} from '../../enums/tooltip.enums';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})

export class TooltipComponent implements OnInit {
  tooltip = '';
  position: TooltipPosition = TooltipPosition.DEFAULT;
  left = 0;
  top = 0;

  constructor() {
  }

  ngOnInit(): void {
  }
}
