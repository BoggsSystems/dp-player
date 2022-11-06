import { NgModule } from '@angular/core';
import { LazyloadDirective } from './lazyload.directive';

@NgModule({
  declarations: [LazyloadDirective],
  exports: [LazyloadDirective],
})

export class ImagesLazyloadModule {}