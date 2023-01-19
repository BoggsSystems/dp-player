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

@Component({
  selector: 'digit-pop-user-rewards',
  templateUrl: './user-rewards.component.html',
  styleUrls: ['./user-rewards.component.scss']
})

export class UserRewardsComponent implements OnInit {
  isUser = false;
  redemptionPopupDialogRef: MatDialogRef<RedemptionpopupComponent>;
  failurePopupDialogRef: MatDialogRef<FailurepopupComponent>;
  rewards: { provider: string, pointsRequired: number }[];

  constructor(public authService: XchaneAuthenticationService, private dialog: MatDialog, public redemptionService: RedemptionService) {
    this.rewards = [{
      provider: 'sling', pointsRequired: 2000,
    }, {
      provider: 'netflix', pointsRequired: 1100,
    }, {
      provider: 'hulu', pointsRequired: 600,
    }, {
      provider: 'amazon', pointsRequired: 1300,
    }, {
      provider: 'spotify', pointsRequired: 1000,
    }, {
      provider: 'applemusic', pointsRequired: 1000,
    }, {
      provider: 'pandora', pointsRequired: 1000,
    }, {
      provider: 'tidal', pointsRequired: 1000,
    }, {
      provider: 'wallstreetjournal', pointsRequired: 1000,
    }, {
      provider: 'newyorktimes', pointsRequired: 1200,
    }, {
      provider: 'usatoday', pointsRequired: 1000,
    }, {
      provider: 'latimes', pointsRequired: 800,
    }, {
      provider: 'nbatv', pointsRequired: 1800,
    }, {
      provider: 'mlbtv', pointsRequired: 2500,
    }, {
      provider: 'gamefly', pointsRequired: 1600,
    }, {
      provider: 'youtubetv', pointsRequired: 4000,
    }];
  }

  ngOnInit(): void {
    this.isUser = localStorage.getItem('XchaneCurrentUser') !== null;
  }

  public RedeemReward = (reward: string) => {
    const redemption = new Redemption();
    redemption.rewarder = reward;
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

  public sortByPoints = (rewards: { provider: string, pointsRequired: number }[]) => {
    return rewards.sort((a, b) => {
      return a.pointsRequired - b.pointsRequired;
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
