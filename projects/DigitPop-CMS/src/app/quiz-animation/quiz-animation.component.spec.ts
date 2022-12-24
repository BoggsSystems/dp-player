import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizAnimationComponent } from './quiz-animation.component';

describe('QuizAnimationComponent', () => {
  let component: QuizAnimationComponent;
  let fixture: ComponentFixture<QuizAnimationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuizAnimationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizAnimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
