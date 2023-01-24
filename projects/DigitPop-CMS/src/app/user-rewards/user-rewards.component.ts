import {Component, OnInit} from '@angular/core';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {Redemption} from '../shared/models/redemption';
import {
  RedemptionpopupComponent
} from '../xchane/redemptionpopup/redemptionpopup.component';
import {
  FailurepopupComponent
} from '../xchane/failurepopup/failurepopup.component';
import {
  throwError as observableThrowError
} from 'rxjs/internal/observable/throwError';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {XchaneUser} from '../shared/models/xchane.user';
import {RedemptionService} from '../shared/services/redemption.service';
import {RewardService} from '../shared/services/reward.service';
import {Reward} from '../shared/models/reward';

@Component({
  selector: 'digit-pop-user-rewards',
  templateUrl: './user-rewards.component.html',
  styleUrls: ['./user-rewards.component.scss']
})

export class UserRewardsComponent implements OnInit {
  isUser = false;
  currentUser: XchaneUser;
  redemptionPopupDialogRef: MatDialogRef<RedemptionpopupComponent>;
  failurePopupDialogRef: MatDialogRef<FailurepopupComponent>;
  rewards: Reward[];

  // tslint:disable-next-line:max-line-length
  constructor(public authService: XchaneAuthenticationService, private dialog: MatDialog, public redemptionService: RedemptionService, private rewardService: RewardService) {
    this.rewardService
      .getRewards()
      .subscribe((rewards: Reward[]) => {
        this.rewards = rewards;
      });
  }

  ngOnInit(): void {
    this.isUser = localStorage.getItem('XchaneCurrentUser') !== null;
    this.currentUser = this.isUser ? JSON.parse(localStorage.getItem('XchaneCurrentUser')) : null;
  }

  public RedeemReward = (reward: string) => {
    const redemption = new Redemption();
    redemption.reward = reward;
    redemption.userId = this.currentUser._id;

    this.redemptionService.requestRedemption(redemption).subscribe(() => {
      this.refreshUser();

      this.redemptionPopupDialogRef = this.dialog.open(RedemptionpopupComponent, {
        autoFocus: true, hasBackdrop: false, closeOnNavigation: true,
      });
    }, (error: any) => {
      this.failurePopupDialogRef = this.dialog.open(FailurepopupComponent, {
        autoFocus: true, hasBackdrop: false, closeOnNavigation: true,
      });

      return observableThrowError(error);
    });
  }

  public sortByPoints = (rewards: Reward[]) => {
    return rewards.sort((a, b) => {
      return a.points - b.points;
    });
  }

  public wheelScrollHorizontally = (event: WheelEvent) => {
    event.preventDefault();
    const element = document.querySelector('.rewards--gallery');

    element.scrollBy({
      left: event.deltaY < 0 ? -250 : 250,
    });
  }

  public navScrollHorizontally = (toRight = false) => {
    const element = document.querySelector('.rewards--gallery');
    const visibleWidth = element.getBoundingClientRect().width;
    const width = element.scrollLeft;
    element.scrollLeft = toRight ? (+visibleWidth / 2) + width : -(+visibleWidth / 2) + width;
  }

  private refreshUser = () => {
    this.authService.getCurrentXchaneUser().subscribe((user) => {
      let use = new XchaneUser();
      use = user as XchaneUser;
      this.authService.storeUser(use);
    }, (error: any) => {
      this.failurePopupDialogRef = this.dialog.open(FailurepopupComponent, {
        autoFocus: true, hasBackdrop: false, closeOnNavigation: true,
      });

      return observableThrowError(error);
    });
  }
}
