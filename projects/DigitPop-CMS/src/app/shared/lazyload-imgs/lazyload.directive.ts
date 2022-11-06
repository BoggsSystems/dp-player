import { Injector, Directive, ElementRef } from '@angular/core';
import { LazyloadService } from './lazyload.service';

@Directive({
	selector: '[loading]',
})

export class LazyloadDirective {
	constructor(private injector: Injector, private el: ElementRef) {
		const img = this.el.nativeElement;

		if ('loading' in HTMLImageElement.prototype && img.tagName.toLowerCase() === 'img') {
			img.src = img.dataset?.src;
		} else {
			const lazyService = this.injector.get(LazyloadService);
			lazyService.observe(img);
		}
	}
}