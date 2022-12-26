import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorPopupComponent } from './visitor-popup.component';

describe('VisitorPopupComponent', () => {
  let component: VisitorPopupComponent;
  let fixture: ComponentFixture<VisitorPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitorPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
