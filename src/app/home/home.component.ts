import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { BehaviorSubject } from 'rxjs';
import { ErrorSnackbar, SuccessSnackbar } from '../common/snackbar.component';
import { HomeService } from '../core/services/home.service';

@Component({
  selector: 'home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss'],
})
export class HomeComponent implements OnInit {
  public searchTerm: string = '';
  public readonlyMode: boolean = false;
  public showCardInfo = false;
  // centerSubject = new BehaviorSubject([]);
  public states: any = [];
  public districts: any = [];
  public centerData: any = [];
  public filteredCenterData: any = [];
  public districtId: any;
  public is18to44: boolean = false;
  public is45Plus: boolean = false;
  public isAvlSlots: boolean = false;
  public isMultipleSelectable: boolean = true;

  constructor(
    private homeService: HomeService,
    private _snackBar: MatSnackBar
  ) {
    // this.centerSubject.subscribe((centers) => {
    //   console.log(centers);
    //   this.centerData = [...centers];
    // });
  }

  async ngOnInit() {
    this.states = await this.homeService.getStates();
    console.log(this.states);
  }

  async findCenters() {
    this.filteredCenterData = [];
    this.centerData = [];
    console.log(this.searchTerm);
    if (this.searchTerm.match(/^[1-9][0-9]{5}$/)) {
      this.centerData = await this.getCenterInfoByPin(this.searchTerm, '28');
      this.filteredCenterData = this.centerData;
    } else {
      this._snackBar.openFromComponent(ErrorSnackbar, {
        data: 'Please Check the provided PINCODE',
        duration: 3000,
      });
    }
  }

  async getCenterInfoByPin(pincode, days) {
    const locale = 'en-US';
    let centerList: any = [];
    try {
      const weeks = Math.floor(days / 7);
      if (weeks == 0) {
        const today = new Date();
        const newDate = formatDate(today, 'dd-MM-yyyy', locale);
        console.log(`Today: ${newDate}`);
        return await this.homeService.getCenterDetailsByPin(pincode, newDate);
      } else {
        for (let i = 0; i < weeks; i++) {
          const today = new Date();
          var newFutureDate = new Date(today.setDate(today.getDate() + 7 * i));
          const futureDate = formatDate(newFutureDate, 'dd-MM-yyyy', locale);
          console.log(`Today: ${futureDate}`);
          let newCenters = await this.homeService.getCenterDetailsByPin(
            pincode,
            futureDate
          );
          centerList = await this.aggregateCentersSessions(
            centerList,
            newCenters
          );
        }
        return centerList;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async aggregateCentersSessions(centerList, newCenters) {
    let newList = [];
    if (centerList.length == 0) {
      console.log('Adding New Data');
      centerList = newCenters;
      return centerList;
    } else {
      console.log('Already have data. adding sessions');
      for (let i = 0; i < newCenters.centers.length; i++) {
        for (let j = 0; j < centerList.centers.length; j++) {
          const newCenter = newCenters.centers[i];
          const oldCenter = centerList.centers[j];
          if (newCenter.center_id == oldCenter.center_id) {
            centerList.centers[j].sessions = [
              ...centerList.centers[j].sessions,
              ...newCenter.sessions,
            ];
          }
        }
      }

      // Check for newly added centers
      let oldCenterIds = [];
      let newCenterIds = [];
      centerList.centers.forEach((oldCent) => {
        oldCenterIds.push(oldCent.center_id);
      });

      newCenters.centers.forEach((newCent) => {
        newCenterIds.push(newCent.center_id);
      });

      let absentCenterIds = newCenterIds.filter(
        (e) => !oldCenterIds.includes(e)
      );
      console.log(absentCenterIds);

      if (absentCenterIds.length > 0) {
        absentCenterIds.forEach((id) => {
          newCenters.centers.forEach((cent) => {
            if (cent.center_id == id) {
              console.log('Inserting New Center');
              centerList.centers.push(cent);
            }
          });
        });
      }

      return centerList;
    }
  }

  async getDistrictCenterInfo(districtId, days) {
    const locale = 'en-US';
    var centerList = [];
    var apiUrl;
    try {
      const weeks = Math.floor(days / 7);
      if (weeks == 0) {
        const today = new Date();
        const newDate = formatDate(today, 'dd-MM-yyyy', locale);
        console.log(`Today: ${newDate}`);
        return await this.homeService.getCenterDetailsByDistrict(
          districtId,
          newDate
        );
      } else {
        for (let i = 0; i < weeks; i++) {
          console.log(i);
          const today = new Date();
          var newFutureDate = new Date(today.setDate(today.getDate() + 7 * i));
          const futureDate = formatDate(newFutureDate, 'dd-MM-yyyy', locale);
          console.log(`Today: ${futureDate}`);
          let newCenters = await this.homeService.getCenterDetailsByDistrict(
            districtId,
            futureDate
          );
          centerList = await this.aggregateCentersSessions(
            centerList,
            newCenters
          );
        }
        return centerList;
      }
    } catch (error) {
      console.log(error.response);
    }
  }

  async filterByMinMaxAgeLimit(centerInfo, minAgeLimit, maxAgeLimit) {
    const localCenterInfo = centerInfo;
    const filteredCenter = localCenterInfo.centers.filter(
      (cent) =>
        cent.sessions[0].min_age_limit >= minAgeLimit &&
        cent.sessions[0].min_age_limit <= maxAgeLimit
    );
    let finalData = { centers: [] };
    finalData.centers = [...filteredCenter];
    return finalData;
  }

  async filterByMinAgeLimit(centerInfo, minAgeLimit) {
    for (let i = 0; i < centerInfo.centers.length; i++) {
      const curCenter = centerInfo.centers[i];
      if (curCenter.sessions[0].min_age_limit <= minAgeLimit) {
        centerInfo.centers.splice(i, 1);
      }
    }
    return centerInfo;
  }

  async filterByAvailableLimit(centerInfo, availableCapacity) {
    const localCenter = centerInfo;
    const finalData = { centers: [] };
    const centerData = [];
    localCenter.centers.forEach((cent) => {
      const filteredSessions = cent.sessions.filter(
        (sess) => sess.available_capacity >= availableCapacity
      );
      cent.sessions = filteredSessions;
      centerData.push(cent);
    });
    finalData.centers = [...centerData];

    //Remove Empty session centers
    const finalCenterList = finalData.centers.filter(
      (centr) => centr.sessions.length > 0
    );
    const finalCenterListNew = { centers: [] };
    finalCenterListNew.centers = [...finalCenterList];
    return finalCenterListNew;
  }

  showInfoCard() {
    this.showCardInfo = !this.showCardInfo;
  }

  // async onToggleChange() {
  //   if (this.is18to44) {
  //     this.centerData = await this.filterByMinMaxAgeLimit(
  //       this.centerData,
  //       '18',
  //       '44'
  //     );
  //   }

  //   if (this.is45Plus) {
  //     this.centerData = await this.filterByMinMaxAgeLimit(
  //       this.centerData,
  //       '45',
  //       '50'
  //     );
  //   }

  //   if (this.isAvlSlots) {
  //     this.centerData = await this.filterByAvailableLimit(this.centerData, 1);
  //   }
  // }

  async chipSelected(value: string) {
    if (value === '18-44') {
      if (this.is18to44) {
        this.filteredCenterData = await this.filterByMinMaxAgeLimit(
          this.centerData,
          '18',
          '44'
        );
      } else {
        this.filteredCenterData = this.centerData;
      }
    }

    if (value === '45+') {
      if (this.is45Plus) {
        this.filteredCenterData = await this.filterByMinMaxAgeLimit(
          this.centerData,
          '45',
          '50'
        );
      } else {
        this.filteredCenterData = this.centerData;
      }
    }

    if (value === 'ALL') {
      if (this.is18to44 || this.is45Plus) {
        if (this.isAvlSlots) {
          this.filteredCenterData = await this.filterByAvailableLimit(
            this.filteredCenterData,
            1
          );
        } else {
          if (this.searchTerm) {
            await this.findCenters();
          } else {
            this.gatherDistrictData();
          }
        }
      } else {
        if (this.isAvlSlots) {
          this.filteredCenterData = await this.filterByAvailableLimit(
            this.centerData,
            1
          );
        } else {
          if (this.searchTerm) {
            await this.findCenters();
          } else {
            this.gatherDistrictData();
          }
        }
      }
    }
  }

  async stateSelected($event) {
    console.log($event);
    const stateId = $event.value;
    this.districts = await this.homeService.getDistricts(stateId);
    console.log(this.districts);
  }

  async districtSelected($event) {
    this.filteredCenterData = [];
    this.centerData = [];
    this.districtId = $event.value;
    this.centerData = await this.getDistrictCenterInfo(this.districtId, '28');
    this.filteredCenterData = this.centerData;
  }

  async gatherDistrictData() {
    if (this.districtId) {
      this.centerData = await this.getDistrictCenterInfo(this.districtId, '28');
      this.filteredCenterData = this.centerData;
    }
  }
}
