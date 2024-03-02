import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map , throwError  , catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private loggedIn = new BehaviorSubject<boolean>(false);
  private userRole: string | null = null;
  private justLoggedIn:boolean = false;
  private baseUrl:string = 'http://localhost:8080/user';
  private userId!:string;
  private userName!:string;
  private name!:string;
  private email!:string;



  constructor(private http: HttpClient) { }

  get isAuthenticated(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  // login(role: string,user:any) {

  //   this.loggedIn.next(true);
  //   this.userRole = role;


  //   return this.http.post<any>(`${this.baseUrl}/login`, user).pipe(
  //     map((userData: any) => {
  //        console.log(userData);
  //        if (!userData || !userData.token) {
  //            throw new Error('Invalid response data');
  //        }
  //        sessionStorage.setItem('username', user.username);
  //        let tokenStr = 'Bearer ' + userData.token;
  //        sessionStorage.setItem('token', tokenStr);
  //        return userData;
  //     }),
  //     catchError(error => {
  //         console.error('Error:', error);
  //         // Handle the error here (e.g., show error message to user)
  //         return throwError(error); // re-throw the error to propagate it to the subscriber
  //     })
  //  );


  // }

  login(role: string, user: any): Promise<any> {

    return new Promise((resolve, reject) => {
      this.http.post<any>(`${this.baseUrl}/login`, user).subscribe(
        (response: any) => {
          sessionStorage.setItem('username', user.username);
          let tokenStr = 'Bearer ' + response.token;
          sessionStorage.setItem('token', tokenStr);
          resolve(response);
          this.loggedIn.next(true);
          this.userRole = role;
        },
        (error: any) => {
          console.error('Login failed', error);
          sessionStorage.clear();
          reject(error);
        }
      );
    });
  }

  logout() {
    this.loggedIn.next(false);
    this.userRole = null;
    sessionStorage.removeItem('username')
  }

  register(user: any) {
    console.log(user);

    return this.http.post<any>('http://localhost:8080/user/register', user);
  }

  updateUser(userData: any): Observable<any> {

    return this.http.put(`${this.baseUrl}/complete-details`, userData);
  }

  forgotPassword(user:any){
    const url = `${this.baseUrl}/forgot-password/${user.username}?oldPassword=${user.oldPassword}&newPassword=${user.newPassword}`;
    return this.http.post<any>(url,null);
  }

  getUserById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-user-by-id/${userId}`, );
  }

  getUserDataById(userId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/get-user-data-by-id/${userId}`, );
  }


  getUserRole(): string | null {
    return this.userRole;
  }

  switchProfile(role:string) {
    this.userRole = role;
  }

  setJustLoggedIn(state:boolean):boolean{
      this.justLoggedIn = state;

    return this.justLoggedIn;
  }
  getJustLoggedIn():boolean{
    return this.justLoggedIn;
  }

  setuserId(userId:string){
    this.userId = userId;
  }
  getuserId(){
    return this.userId;
  }
  setuserName(userName:string){
    this.userName = userName;
  }
  getuserName(){
    return this.userName;
  }
  setname(userName:string){
    this.userName = userName;
  }
  getname(){
    return this.userName;
  }
  setemail(email:string){
    this.email = email;
  }
  getemail(){
    return this.email;
  }







}
