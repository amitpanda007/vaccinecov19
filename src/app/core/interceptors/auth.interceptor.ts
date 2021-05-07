import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth.service";
import { Observable, throwError } from "rxjs";
import { mergeMap, catchError } from "rxjs/operators";
import { LocalStorageService } from "../services/local.storage.service";

const ACC_TOKEN_KEY = "accessToken";
const REF_TOKEN_KEY = "refreshToken";
const FULLNAME_KEY = "fullName";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!/.*\/auth\/.*/.test(req.url)) {
      console.log("HTTPInterceptorTriggered");
      console.log(req.url);
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
