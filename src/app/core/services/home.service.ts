import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class HomeService {
  constructor(private _router: Router, private http: HttpClient) {}

  //admin/location/states
  getStates() {
    const apiUrl = `${environment.cowinApiUrl}admin/location/states`
    return this.http.get(apiUrl).toPromise();
  }

  //admin/location/districts/{stateId}
  getDistricts(stateId: string) {
    const apiUrl = `${environment.cowinApiUrl}admin/location/districts/${stateId}`
    return this.http.get(apiUrl).toPromise();
  }

  //appointment/sessions/public/calendarByPin?pincode=751003&date=02-05-2021
  getCenterDetailsByPin(pincode: string, date: string) {
    const apiUrl = `${environment.cowinApiUrl}appointment/sessions/public/calendarByPin?pincode=${pincode}&date=${date}`
    return this.http.get(apiUrl).toPromise();
  }

  //appointment/sessions/public/calendarByDistrict?district_id=446&date=03-05-2021
  getCenterDetailsByDistrict(districtId: string, date: string) {
    const apiUrl = `${environment.cowinApiUrl}appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`
    return this.http.get(apiUrl).toPromise();
  }
  
}
