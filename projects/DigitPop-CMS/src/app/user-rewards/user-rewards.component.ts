import {Component, OnInit} from '@angular/core';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {Redemption} from '../shared/models/redemption';
import {
  RedemptionpopupComponent
} from '../xchane/redemptionpopup/redemptionpopup.component';
import {
  throwError as observableThrowError
} from 'rxjs/internal/observable/throwError';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {XchaneUser} from '../shared/models/xchane.user';
import {RedemptionService} from '../shared/services/redemption.service';
import {RewardService} from '../shared/services/reward.service';
import {Reward} from '../shared/models/reward';
import {
  AnswerDialogComponent
} from '../xchane/answer-dialog/answer-dialog.component';
import {DataService} from '../xchane/services/data.service';

@Component({
  selector: 'digit-pop-user-rewards',
  templateUrl: './user-rewards.component.html',
  styleUrls: ['./user-rewards.component.scss']
})

export class UserRewardsComponent implements OnInit {
  isUser = false;
  currentUser: XchaneUser;
  redemptionPopupDialogRef: MatDialogRef<RedemptionpopupComponent>;
  failurePopupDialogRef: MatDialogRef<RedemptionpopupComponent>;
  rewards: Reward[];

  // tslint:disable-next-line:max-line-length
  constructor(public authService: XchaneAuthenticationService, private dialog: MatDialog, public redemptionService: RedemptionService, private rewardService: RewardService, private data: DataService) {
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

  public RedeemReward = (reward: string, rewardPoints: number) => {
    const redemption = new Redemption();
    redemption.reward = reward;
    redemption.userId = this.currentUser._id;

    const confirmDialog = this.dialog.open(AnswerDialogComponent, {
      panelClass: 'dpop-modal', data: {
        title: 'Confirm Redemption',
        message: `Are you sure you want to redeem ${reward} for ${rewardPoints} points?`,
      },
    });

    return confirmDialog.afterClosed().subscribe((result: boolean) => {
      confirmDialog.close();

      if (result === true) {
        this.redemptionService.requestRedemption(redemption).subscribe(() => {
          this.refreshUser();

          this.redemptionPopupDialogRef = this.dialog.open(RedemptionpopupComponent, {
            panelClass: 'dpop-modal',
            autoFocus: true,
            hasBackdrop: true,
            closeOnNavigation: true,
            data: {
              title: 'Points Redeemed',
              message: 'Points successfully redeemed.<br> Check email for electronic gift card.'
            }
          });
        }, (error: any) => {
          this.failurePopupDialogRef = this.dialog.open(RedemptionpopupComponent, {
            panelClass: 'dpop-modal',
            autoFocus: true,
            hasBackdrop: true,
            closeOnNavigation: true,
            data: {
              title: 'Unable to redeem points',
              message: 'Insufficient points for redemption'
            }
          });

          return observableThrowError(error);
        });
      }
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
      let use: XchaneUser;
      use = user as XchaneUser;
      this.authService.storeUser(use);
      this.data
        .updateUserCredit(use.credits);
    }, (error: any) => {
      this.failurePopupDialogRef = this.dialog.open(RedemptionpopupComponent, {
        autoFocus: true, hasBackdrop: true, closeOnNavigation: true, data: {
          title: 'Unable to redeem points',
          message: 'Insufficient points for redemption'
        }
      });

      return observableThrowError(error);
    });
  }
}
