import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import html2canvas from 'html2canvas';
import {
  SuccessSnackbar,
  ErrorSnackbar,
} from 'src/app/common/snackbar.component';

@Component({
  selector: 'center-card',
  templateUrl: 'center.card.component.html',
  styleUrls: ['center.card.component.scss'],
})
export class CenterCardComponent implements OnInit {
  @ViewChild('screen', { static: false }) screen: ElementRef;

  @Input() center: any;
  @Input() index: any;
  @Input() viewOnlyMode: boolean = false;

  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit(): void {
    // this.index = this.index + 1;
  }

  async shareCenterDetail(interviewId: string) {
    let angularNavigator: any;
    angularNavigator = window.navigator;

    const baseUrl = window.location.origin;
    const shareData = {
      title: 'Interview URL',
      text: 'click on URL to navigate to an Interview',
      url: `${baseUrl}/interview/${interviewId}`,
    };

    if (angularNavigator && angularNavigator.share) {
      await angularNavigator.share(shareData).then((_) => {
        this._snackBar.openFromComponent(SuccessSnackbar, {
          data: 'Interview shared successfully',
          duration: 2000,
        });
      });
    } else {
      this._snackBar.openFromComponent(ErrorSnackbar, {
        data: 'Web Sharing is not supported',
        duration: 2000,
      });
    }
  }

  downloadImage(centerName) {
    html2canvas(this.screen.nativeElement, { scrollY: -window.scrollY }).then(
      (canv) => {
        let myLink = document.createElement('a');
        myLink.href = canv.toDataURL('image/png');
        myLink.download = `${centerName}.png`;
        myLink.click();
      }
    );
  }
}
