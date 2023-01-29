import {Component, OnInit} from '@angular/core';
import {Redemption} from '../shared/models/redemption';
import {RedemptionService} from '../shared/services/redemption.service';
import {
  XchaneAuthenticationService
} from '../shared/services/xchane-auth-service.service';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  selector: 'digit-pop-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})

export class UserDashboardComponent implements OnInit {
  userId: string;
  userPoints: number;
  registerDate: string;
  totalRedeemed: number;
  myRedemptions: Redemption[];
  redemptionsCount: number;
  monthNames: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  stats: {
    icon: string,
    span: string,
    description: string,
    class: string,
    value: number
  }[];
  copyClipboardText: string;

  constructor(private redemptionService: RedemptionService, private auth: XchaneAuthenticationService, private clipboard: Clipboard) {
    this.userId = this.auth.currentUserValue._id;
    this.userPoints = this.auth.currentUserValue.credits;
    this.stats = [
      {
        icon: 'cup.svg',
        span: 'Points earned',
        description: 'over the past two years',
        value: this.userPoints,
        class: ''
      },
      {
        icon: 'arrows.svg',
        span: 'Points redeemed',
        description: 'Points converted into gifts in the last two years',
        value: 0o000,
        class: 'redeemed--card'
      }
    ];
  }

  ngOnInit(): void {
    this.redemptionService
      .getMyRedemptions({userId: this.userId})
      .subscribe((redemptions: Redemption[]) => {
        this.myRedemptions = redemptions;
        this.redemptionsCount = redemptions.length;
        this.totalRedeemed = this.countTotalRedeemed(redemptions);

        this.stats[1].value = this.totalRedeemed;
      });
  }

  countTotalRedeemed = (redemptions: Redemption[]): number => {
    let total = 0;
    redemptions.forEach(redemption => total += +redemption.points);

    return total;
  }
  prettyDate = (d: Date) => {
    const date = new Date(d);
    return `${this.monthNames[date.getMonth()]}, ${date.getDate()} - ${date.getFullYear()}`;
  }

  onCopyToClipboard = (giftCode: string) => {
    this.clipboard.copy(giftCode);
  }
}
