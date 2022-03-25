import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'NestedCampaignsTable',
    templateUrl: './campaigns.component.html',
    styleUrls: ['./nested.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
        trigger('pgDetailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})

export class NestedCampaigns implements AfterViewInit {
    @Input() data: any;

    innerProductDisplayedColumns: string[] = [
        'thumbnail',
        'name',
        'clickCount',
        'clickBuyNowCount',
    ];
    dataSource: MatTableDataSource<Element>;

    @ViewChild('tableSorter', { static: false }) tableSorter: MatSort;
    ngAfterViewInit() {
        this.dataSource = new MatTableDataSource(this.data);
        this.dataSource.sortingDataAccessor = (item: any, property: any) => {
            if (item[property]) {
                return item[property];
            } else {
                return item.stats[property];
            }
        };
        this.dataSource.sort = this.tableSorter;
    }
}