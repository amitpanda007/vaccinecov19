import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { NavService } from "../services/nav.service";
import { AngularFireAuth } from "@angular/fire/auth";

@Component({
  selector: "nav",
  templateUrl: "nav.component.html",
  styleUrls: ["nav.component.scss"],
})
export class NavComponent implements OnInit {
  baseClass: string = "";
  authenticated: boolean = false;
  fullName: string = "";
  public isAdminUser = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private navService: NavService,
    public afAuth: AngularFireAuth
  ) {}

  ngOnInit(): void {
    this.baseClass = "toolbar";

    this.navService.newClass$.subscribe((className) => {
      console.log(className);
      this.baseClass = className;
    });

    this.auth.isAdmin().subscribe((value: any) => {
      this.isAdminUser = value;
    });
  }

  openLogin() {
    this.router.navigate(["/login"]);
  }

  openRegister() {
    this.router.navigate(["/register"]);
  }

  // openAdminPage() {
  //   this.router.navigate(["/admin"]);
  // }
}
