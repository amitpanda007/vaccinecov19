import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CacheService {
  public responseCache = new Map();

  constructor(private http: HttpClient) {}

  public setCache(cache_key: any, cache_data: any): any {
    this.responseCache.set(cache_key, cache_data);
  }

  public getCache(cache_key: any) {
    return this.responseCache.get(cache_key);
  }
}
