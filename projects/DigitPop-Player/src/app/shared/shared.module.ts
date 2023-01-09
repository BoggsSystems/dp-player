import {NgModule} from '@angular/core';
import {SafePipe} from './pipes/SafePipe';
import {TooltipComponent} from './components/tooltip/tooltip.component';
import {TooltipDirective} from './directives/tooltip.directive';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [SafePipe, TooltipDirective],
  declarations: [SafePipe, TooltipComponent, TooltipDirective],
  providers: [],
})
export class SharedModule {
}
