import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    Output,
    EventEmitter,
  } from "@angular/core";
  import { MatDialog, MatSnackBar } from "@angular/material";
  import { ActivatedRoute, Router } from "@angular/router";
  import {
    DeleteConfirmationDialogComponent,
    DeleteConfirmationDialogResult,
  } from "src/app/common/delete.dialog.component";
  import {
    SuccessSnackbar,
    ErrorSnackbar,
  } from "src/app/common/snackbar.component";

  
  @Component({
    selector: "center-card",
    templateUrl: "center.card.component.html",
    styleUrls: ["center.card.component.scss"],
  })
  export class CenterCardComponent implements OnInit {
    @Input() center: any;
    @Input() index: any;
    @Input() viewOnlyMode: boolean = false;
  
    constructor(
      private _router: Router,
      private _route: ActivatedRoute,
      private _snackBar: MatSnackBar,
      private _dialog: MatDialog
    ) {}
  
    ngOnInit(): void {
      this.index = this.index + 1;
    }
  
    async shareCenterDetail(interviewId: string) {
      let angularNavigator: any;
      angularNavigator = window.navigator;
  
      const baseUrl = window.location.origin;
      const shareData = {
        title: "Interview URL",
        text: "click on URL to navigate to an Interview",
        url: `${baseUrl}/interview/${interviewId}`,
      };
  
      if (angularNavigator && angularNavigator.share) {
        await angularNavigator.share(shareData).then((_) => {
          this._snackBar.openFromComponent(SuccessSnackbar, {
            data: "Interview shared successfully",
            duration: 2000,
          });
        });
      } else {
        this._snackBar.openFromComponent(ErrorSnackbar, {
          data: "Web Sharing is not supported",
          duration: 2000,
        });
      }
    }
  }