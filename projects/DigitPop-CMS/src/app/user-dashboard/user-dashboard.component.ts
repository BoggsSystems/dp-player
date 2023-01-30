import {Component, OnDestroy, OnInit} from '@angular/core';
import {Redemption} from '../shared/models/redemption';
import {RedemptionService} from '../shared/services/redemption.service';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {Clipboard} from '@angular/cdk/clipboard';
import {DataService} from '../xchane/services/data.service';
import {Subscription} from 'rxjs';

export interface State {
  icon: string;
  span: string;
  description: string;
  class: string;
  value: number;
}

@Component({
  selector: 'digit-pop-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})

export class UserDashboardComponent implements OnInit, OnDestroy {
  userId: string;
  userPoints: number;
  registerDate: string;
  totalRedeemed: number;
  totalEarned: number;
  myRedemptions: Redemption[];
  redemptionsCount: number;
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  stats: State[];
  copyClipboardText: string;
  private rewardsSubscription: Subscription;

  // tslint:disable-next-line:max-line-length
  constructor(private redemptionService: RedemptionService, private auth: XchaneAuthenticationService, private clipboard: Clipboard, private data: DataService) {
    this.userId = this.auth.currentUserValue._id;
    this.userPoints = this.auth.currentUserValue.credits;
    this.stats = this.updatedStats();
  }

  ngOnInit(): void {
    this.getRedemptions();

    this.rewardsSubscription = this.data
      .getUserCredit()
      .subscribe(points => {
        this.userPoints = points.points;
        this.stats = this.updatedStats();
        this.getRedemptions();
      });
  }

  getRedemptions = (): void => {
    this.redemptionService
      .getMyRedemptions({userId: this.userId})
      .subscribe((redemptions: Redemption[]) => {
        this.myRedemptions = redemptions;
        this.redemptionsCount = redemptions.length;
        this.totalRedeemed = this.calculateTotalRedeemed(redemptions);
        this.totalEarned = this.calculateTotalEarned();
        this.stats = this.updatedStats();
      });
  }

  updatedStats = (): State[] => {
    return [
      {
        icon: 'cup.svg',
        span: 'Points earned',
        description: 'Since you joined digitpop!',
        value: this.totalEarned ? this.totalEarned : 0o000,
        class: ''
      },
      {
        icon: 'arrows.svg',
        span: 'Points redeemed',
        description: 'Points converted into gifts',
        value: this.totalRedeemed ? this.totalRedeemed : 0o000,
        class: 'redeemed--card'
      },
      {
        icon: 'check-mark-icon.svg',
        span: 'Points remaining',
        description: 'Available points for redemption',
        value: this.userPoints,
        class: 'available--card'
      }
    ];
  }

  calculateTotalRedeemed = (redemptions: Redemption[]): number => {
    let total = 0;
    redemptions.forEach(redemption => total += +redemption.points);

    return total;
  }

  calculateTotalEarned = (): number => {
    return this.totalEarned = this.userPoints + this.totalRedeemed;
  }

  prettyDate = (d: Date) => {
    const date = new Date(d);
    return `${this.monthNames[date.getMonth()]}, ${date.getDate()} - ${date.getFullYear()}`;
  }

  onCopyToClipboard = (giftCode: string) => {
    this.clipboard.copy(giftCode);
  }

  ngOnDestroy() {
    this.rewardsSubscription.unsubscribe();
  }
}
