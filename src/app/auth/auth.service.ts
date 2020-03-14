import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + "/user/";
@Injectable({providedIn:"root"})
export class AuthService{
  private token:string;
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private userId: string;

  constructor(private http: HttpClient, private router: Router){}

  getToken(){
    // getter for encapsulation
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  getUserId () {
    return this.userId;
  }

  createUser(email:string, password:string){
    const authData: AuthData = {email:email, password:password};
    this.http.post(BACKEND_URL+"/signup", authData)
      .subscribe(() =>{
        this.router.navigate(["/"])
      }, error =>{
        this.authStatusListener.next(false);
      })
  }
  login(email:string, password:string){
    const authData: AuthData = {email:email, password:password};
    this.http.post<{token:string, expiresIn: number, userId: string}>(BACKEND_URL+"/login", authData)
      .subscribe(response =>{
        const token = response.token;
        this.token = token;
        if (token){
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token,expirationDate, this.userId)
          this.router.navigate(['/']);
        }
      }, error =>{
        this.authStatusListener.next(false);
      });
  }

  autoAuthUser() {
    const authInfo = this.getAuthData();
    if (!authInfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = authInfo.token;
      this.isAuthenticated = true;
      this.userId = authInfo.userId;
      this.setAuthTimer(expiresIn/1000)
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
    this.clearAuthData();
    this.userId = null;
    clearTimeout(this.tokenTimer);
  }

  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token:string, expirationDate: Date, userId:string) {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiration", expirationDate.toISOString());
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiration");

  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if (!token || !expirationDate){
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId:userId
    }
  }

}
