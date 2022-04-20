import { Component, OnInit, AfterViewInit, ViewChild, Directive, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map, shareReplay, first } from 'rxjs/operators';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from '../../shared/models/project';
import { ProductGroup } from '../../shared/models/productGroup';
import { BillsbyService } from '../../shared/services/billsby.service';
import { CampaignService } from '../../shared/services/campaign.service';
import { ProjectService } from '../../shared/services/project.service';
import { ProductGroupService } from '../../shared/services/product-group.service';
import { AuthenticationService } from '../../shared/services/auth-service.service';
import { WelcomeComponent } from '../help/welcome/welcome.component';
import { ProjectsHelpComponent } from '../help/projects/projects-help.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { Campaign } from '../../shared/models/campaign';
import { OkDialogComponent } from '../ok-dialog/ok-dialog.component';

interface TablesSettings {
  [key: string]: any;
}

interface SortSettings {
  [key: string]: any;
}

@Component({
  selector: 'DigitPop-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
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
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = [
    'thumbnail',
    'name',
    'watchCount',
    'pauseCount',
    'clickCount',
    'buyNowCount',
    'active',
    'createdAt',
    'updatedAt',
    'edit',
  ];

  displayedColumns2: string[] = [
    'name',
    'project',
    'completionCount',
    'engagementCount',
    'impressionCount',
    'budgetAmount',
    'active',
    'campaignEdit',
  ];

  //displayedColumns2: string[] = ['cname', 'position', 'weight', 'symbol'];

  innerDisplayedColumns: string[] = ['title', 'pauseCount', 'clickCount'];
  innerProductDisplayedColumns: string[] = [
    'thumbnail',
    'productName',
    'productClickCount',
    'clickBuyNowCount',
  ];
  dataSource: any;
  campaignsDataSource: any;
  nestedDataSource: String[] = [];
  error = '';
  cid: any;
  width: any;
  height: any;
  expandedElement: Project | null;
  expandedProductGroupElement: ProductGroup | null;
  color: ThemePalette = 'primary';
  projectsPage: number = 0;
  projectsPageSize: number = 5;
  campaignsPage: number = 0;
  campaignsPageSize: number = 5;

  constructor(
    private route: ActivatedRoute,
    private billsbyService: BillsbyService,
    private campaignService: CampaignService,
    private breakpointObserver: BreakpointObserver,
    private projectService: ProjectService,
    private productGroupService: ProductGroupService,
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog,
  ) {
    this.height = 25;
    this.width = 150;
  }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('campaignpaginator') campaignpaginator: MatPaginator;

  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('campaignsorter') campaignsorter: MatSort;


  openWelcomeDialog(): void {
    const dialogRef = this.dialog.open(WelcomeComponent, {
      width: '100%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  getWidth() {
    return this.width;
  }

  getHeight() {
    return this.height;
  }

  welcome() {
    if (!this.authService.currentUserValue.welcomed) {
      this.openWelcomeDialog();

      this.authService.welcome().subscribe(
        (res) => {
          this.authService.currentUserValue.welcomed = true;
        },
        (error) => {
          this.error = error;
        }
      );
    }
  }

  ngOnInit() {
    this.getTablesSetting();
    this.welcome();
  }

  ngAfterViewInit() {
    this.getProjects();
    this.getCampaigns();
  }

  getTablesSetting() {
    if (sessionStorage.getItem('projectsTable') !== null) {
      let settings = sessionStorage.getItem('projectsTable');
      this.projectsPage = +JSON.parse(settings).page;
      this.projectsPageSize = +JSON.parse(settings).pageSize;
    }
    if (sessionStorage.getItem('campaignsTable') !== null) {
      let settings = sessionStorage.getItem('campaignsTable');
      this.campaignsPage = +JSON.parse(settings).page;
      this.campaignsPageSize = +JSON.parse(settings).pageSize;
    }
  }

  getProjects() {
    if (sessionStorage.getItem('myprojects') !== null) {
      const cachedResponse: any = sessionStorage.getItem('myprojects'),
        data = JSON.parse(cachedResponse);
      this.renderProjects(data);
    } else {
      this.projectService
        .getMyProjects()
        .subscribe(
          (res: any) => {
            this.modifyThumbnailUrl(res);
            sessionStorage.setItem('myprojects', JSON.stringify(res));
            this.renderProjects(res);
            let numberOfPages: number = res.length / 5;
            this.populateProjects();
            // for(let i = 0; i < numberOfPages; i++) {
            // }
          },
          (error) => {
            this.error = error;
          }
        );
    }
  }

  populateProjects(page: number = 0, pageSize: number = 5, sorted: boolean = false, sortedby: string = '', sortdir: string='') {
    if (sorted) {
      this.projectService
      .populateMyProject(page, pageSize, sorted, sortedby, sortdir)
      .subscribe(
        (res: any) => {
          this.modifyThumbnailUrl(res);
          let numberOfProjects: number = res.length,
            currentTable:any = sessionStorage.getItem('myprojects'),
            data: any = JSON.parse(currentTable),
            startIndex: number = page * pageSize,
            iterator: number = 0;
          for(let i: number = startIndex; i < numberOfProjects+startIndex; i++) {
            data[i] = res[iterator];
            ++iterator;
          }
          sessionStorage.setItem('myprojects', JSON.stringify(data));
          this.renderProjects(data);
        }
      )
    } else {
      this.projectService
      .populateMyProject(page, pageSize)
      .subscribe(
        (res: any) => {
          this.modifyThumbnailUrl(res);
          let numberOfProjects: number = res.length,
            currentTable:any = sessionStorage.getItem('myprojects'),
            data: any = JSON.parse(currentTable),
            startIndex: number = page * pageSize,
            iterator: number = 0;
          for(let i: number = startIndex; i < numberOfProjects+startIndex; i++) {
            data[i] = res[iterator];
            ++iterator;
          }
          sessionStorage.setItem('myprojects', JSON.stringify(data));
          this.renderProjects(data);
        }
      )
    }

  }

  onTableChange(event: any, source: string) {
    if (source === 'projects') {
      let ProjectsTable: TablesSettings = {};

      if (this.projectsPage != event.pageIndex) {
        this.projectsPage = event.pageIndex;
      }

      if (this.projectsPageSize != event.pageSize) {
        this.projectsPageSize = event.pageSize;
      }

      if(sessionStorage.getItem('sortsettings')) {
        let settings = JSON.parse(sessionStorage.getItem('sortsettings'));
        this.populateProjects(this.projectsPage, this.projectsPageSize, true, settings.active, settings.direction);
      } else {
        this.populateProjects(this.projectsPage, this.projectsPageSize);
      }
      Object.assign(ProjectsTable, {'page': this.projectsPage, 'pageSize': this.projectsPageSize});
      sessionStorage.setItem('projectsTable', JSON.stringify(ProjectsTable));
    } else if(source === 'campaigns') {
      let CampaignsTable: TablesSettings = {};

      if (this.campaignsPage != event.pageIndex) {
        this.campaignsPage = event.pageIndex;
      }

      if (this.campaignsPageSize != event.pageSize) {
        this.campaignsPageSize = event.pageSize;
      }

      Object.assign(CampaignsTable, {'page': this.campaignsPage, 'pageSize': this.campaignsPageSize});
      sessionStorage.setItem('campaignsTable', JSON.stringify(CampaignsTable));
    }
  }

  onTableSort(event: Event) {
    let e = (event as SortSettings),
      sortBy: string = '',
      sortedData: any = this.dataSource.sortData(this.dataSource.data, this.dataSource.sort);
    sortBy = this.getSortBase(e.active);
    e.active = sortBy;
    sessionStorage.setItem('sortsettings', JSON.stringify(e));
    sessionStorage.setItem('myprojects', JSON.stringify(sortedData));
    this.populateProjects(0, 5, true, sortBy, e.direction);
  }

  getSortBase(tableValue: string) {
    switch (tableValue) {
      case 'watchCount':
        return 'stats.videoWatchCount';
      case 'pauseCount':
        return 'stats.videoPauseCount';
      case 'clickCount':
        return 'stats.videoClickCount';
      case 'buyNowCount':
        return 'stats.buyNowClickCount';

      default:
        return tableValue;
    }
  }

  renderProjects(projects: any) {
    this.dataSource = new MatTableDataSource(projects);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'watchCount':
          return item.stats.videoWatchCount;
        case 'pauseCount':
          return item.stats.videoPauseCount;
        case 'clickCount':
          return item.stats.videoClickCount;
        case 'buyNowCount':
          return item.stats.buyNowClickCount;

        default:
          return item[property];
      }
    };
  }

  getCampaigns() {
    if (sessionStorage.getItem('mycampaigns') !== null) {
      const cachedResponse: any = sessionStorage.getItem('mycampaigns');
      this.renderCampaigns(JSON.parse(cachedResponse));
    } else {
      this.campaignService
        .getMyCampaigns()
        .pipe(first())
        .subscribe(
          (campaigns: any) => {
            sessionStorage.setItem('mycampaigns', JSON.stringify(campaigns));
            this.renderCampaigns(campaigns);
          },
          (error) => {
            this.error = error;
          }
        );
    }
  }

  renderCampaigns(campaigns: any) {
    this.campaignsDataSource = new MatTableDataSource<Campaign>(campaigns);
    this.campaignsDataSource.paginator = this.campaignpaginator;
    this.campaignsDataSource.sortingDataAccessor = (item: any, property: any) => {
      switch (property) {
        case 'name':
          return item.name;
        case 'project':
          return item.project.name;
        case 'completionCount':
          return item.stats.completionCount;
        case 'engagementCount':
          return item.stats.engagementCount;
        case 'impressionCount':
          return item.stats.impressionCount;
        case 'budgetAmount':
          return item.budgetAmount;
        case 'spentAmount':
          return item.spentAmount;
        case 'startDate':
          return item.startDate;
        case 'audienceId':
          return item.audienceId;

        default:
          return item[property];
      }
    }
    this.campaignsDataSource.sort = this.campaignsorter;
  }

  modifyThumbnailUrl(response: any) {
    response.forEach((project: any) => {
      if ('thumbnail' in project) {
        let url = project['thumbnail']['url'],
          queryTerm = 'upload/',
          queryLength = queryTerm.length,
          uploadsIndex = url.indexOf(queryTerm),
          paramsIndex = uploadsIndex + queryLength,
          imgHeight = 50,
          imgWidth = 50,
          params = `c_fill,h_${imgHeight},w_${imgWidth}/`,
          resizedUrl = url.substr(0, paramsIndex) + params + url.substr(paramsIndex);

        project['thumbnail']['url'] = resizedUrl;
      }
    });
  }

  projectsHelp() {
    const dialogRef = this.dialog.open(ProjectsHelpComponent, {
      width: '100%',
      height: '90%',
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  campaignsHelp() {
    // const dialogRef = this.dialog.open(ProjectsHelpComponent, {
    //   width: '100%',
    //   height: '90%',
    // });
    // dialogRef.afterClosed().subscribe(() => {
    //   console.log('The dialog was closed');
    // });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    let data: any = filterValue.trim().toLowerCase(),
      cachedProjects: any = JSON.parse(sessionStorage.getItem('cachedResults'));
    console.log(cachedProjects);
    this.dataSource.filter = filterValue.trim().toLowerCase();
    sessionStorage.setItem('cachedResults', JSON.stringify(this.dataSource.filteredData));
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyCampaignsFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.campaignsDataSource.filter = filterValue.trim().toLowerCase();

    if (this.campaignsDataSource.paginator) {
      this.campaignsDataSource.paginator.firstPage();
    }
  }

  launchProjectWizard() {
    this.router.navigate(['/cms/project-wizard']);
  }

  launchCampaignsWizard() {
    this.router.navigate(['/cms/campaign-wizard']);
  }

  onEdit(project: Project) {
    const navigationExtras: NavigationExtras = {
      state: { project: project },
    };
    this.router.navigate(['/cms/project-wizard'], navigationExtras);
  }

  onCampaignEdit(campaign: Campaign) {
    const navigationExtras: NavigationExtras = {
      state: { campaign: campaign },
    };
    this.router.navigate(['/cms/campaign-wizard'], navigationExtras);
  }

  updateCampaignFunc(element: Campaign, e: any) {
    // Retrieve the campaign
    this.campaignService.getCampaign(element).subscribe(
      (res) => {
        var campaign = res as Campaign;

        if (!campaign.project.active) {
          campaign.active = false;
          e.source.checked = false;

          const confirmDialog = this.dialog.open(OkDialogComponent, {
            data: {
              title: 'Project Inactive',
              message:
                'The project for this campaign is inactive.  Activate the project before activiating the campaign.',
            },
          });

          return;
        }

        const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
          data: {
            title: 'Change Status',
            message:
              'Are you sure you want to change the status of the campaign?',
          },
        });

        confirmDialog.afterClosed().subscribe((result) => {
          if (result === true) {
            console.log('Element project : ' + element.project);

            element.active = !element.active;
            this.campaignService.updateCampaign(element).subscribe(
              (res) => {
                console.log(res);
              },
              (error) => {
                console.log(error);
              }
            );
          } else {
            e.source.checked = element.active;
            console.log(
              'toggle should not change if I click the cancel button'
            );
          }
        });
      },
      (error) => {
        console.log(error);
        return;
      }
    );
  }

  updateFunc(element: Project, e: any) {
    if (element.active) {
      this.projectService.getCampaignsForProject(element).subscribe(
        (res) => {
          if (Object.keys(res).length > 0) {
            e.source.checked = true;

            const confirmDialog = this.dialog.open(OkDialogComponent, {
              data: {
                title: 'Active Campaigns',
                message:
                  'There is at least one active campaign using this project. Deactivate the campaign(s) before deactivating this project.',
              },
            });

            return;
          } else {
            this.updateProjectSubFunc(element, e);
          }
        },
        (error) => {
          console.log(error);
          return;
        }
      );
    } else {
      this.updateProjectSubFunc(element, e);
    }
  }

  updateProjectSubFunc(element: Project, e: any) {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Change Status',
        message: 'Are you sure you want to change the status of the project?',
      },
    });

    confirmDialog.afterClosed().subscribe((result) => {
      if (result === true) {
        element.active = !element.active;
        this.projectService.updateProject(element).subscribe(
          (res) => {
            console.log(res);
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        e.source.checked = element.active;
        console.log('toggle should not change if I click the cancel button');
      }
    });
  }
}
