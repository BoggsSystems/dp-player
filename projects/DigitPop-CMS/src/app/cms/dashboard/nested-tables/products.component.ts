import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ProductGroup } from '../../../shared/models/productGroup';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'NestedProductsTable',
    templateUrl: './products.component.html',
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
            state('collapsed, void', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ), transition(
                'expanded <=> void',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            ),
        ]),
    ],
})

export class NestedProducts implements AfterViewInit {
    @Input() data: any;

    expandedProductGroupElement: ProductGroup | null;
    innerDisplayedColumns: string[] = ['title', 'pauseCount', 'clickCount'];
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