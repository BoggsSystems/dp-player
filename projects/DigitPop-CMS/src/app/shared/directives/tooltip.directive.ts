import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  EmbeddedViewRef,
  HostListener,
  Injector,
  Input
} from '@angular/core';
import {TooltipComponent} from '../components/tooltip/tooltip.component';
import {TooltipPosition} from '../enums/tooltip.enums';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[tooltip]'
})

export class TooltipDirective {
  @Input() tooltip = '';
  @Input() tooltipPosition: TooltipPosition = TooltipPosition.DEFAULT;

  private componentRef: ComponentRef<any> = null;

  // tslint:disable-next-line:max-line-length
  constructor(private elementRef: ElementRef, private appRef: ApplicationRef, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
  }

  ngOnDestroy(): void {
    this.destroy();
  }

  @HostListener('mouseenter') onMouseEnter(): void {
    if (this.componentRef === null) {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(TooltipComponent);

      this.componentRef = componentFactory.create(this.injector);
      this.appRef.attachView(this.componentRef.hostView);

      const element = (this.componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;

      document.body.appendChild(element);
      this.setTooltipComponentProperties();
    }
  }

  @HostListener('mouseleave') onMouseLeave(): void {
    this.destroy();
  }

  destroy(): void {
    if (this.componentRef !== null) {
      this.appRef.detachView(this.componentRef.hostView);
      this.componentRef.destroy();
      this.componentRef = null;
    }
  }

  private setTooltipComponentProperties() {
    if (this.componentRef !== null) {
      this.componentRef.instance.tooltip = this.tooltip;
      this.componentRef.instance.position = this.tooltipPosition;

      const {
        left, right, top, bottom
      } = this.elementRef.nativeElement.getBoundingClientRect();

      switch (this.tooltipPosition) {
        case TooltipPosition.BELOW: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(bottom);
          break;
        }
        case TooltipPosition.ABOVE: {
          this.componentRef.instance.left = Math.round((right - left) / 2 + left);
          this.componentRef.instance.top = Math.round(top);
          break;
        }
        case TooltipPosition.RIGHT: {
          this.componentRef.instance.left = Math.round(right);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        case TooltipPosition.LEFT: {
          this.componentRef.instance.left = Math.round(left);
          this.componentRef.instance.top = Math.round(top + (bottom - top) / 2);
          break;
        }
        default: {
          break;
        }
      }
    }
  }
}
