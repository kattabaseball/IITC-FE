import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../Dto/ApiResponseDto';
import { LoginDto } from '../Dto/LoginDto';
import { UserSessionDto } from '../Dto/UserSessionDto';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  BASEURL = "https://localhost:7073/api/";

  constructor(private http: HttpClient, private jwt: JwtHelperService) { }

  public loginApi(credentials: LoginDto) : Observable<ApiResponseDto>
{
  return this.http.post<ApiResponseDto>( this.BASEURL + "Authentication/login", credentials);
}

isLoggedIn(): boolean {
  if (
    localStorage.getItem('access_token') != null &&
    !this.jwt.isTokenExpired()
  )
   return true;
 return false;
}

//checks for a token in local storage and then decode it
getUserInfo(): UserSessionDto | null {
  if(!this.isLoggedIn()) return null;
  var decodedToken = this.jwt.decodeToken();

  var user : UserSessionDto = {
    userId: decodedToken.UserId,
    userName: decodedToken.UserName,
    email: decodedToken.Email,
    mobile: decodedToken.Mobile,
  };

  if(sessionStorage.getItem('userId') != null)
  {      
      sessionStorage.setItem('userId', user.userId);
      sessionStorage.setItem('userName', user.userName);
      sessionStorage.setItem('email', user.email);
      sessionStorage.setItem('mobile', user.mobile);
  }

  return user;
}

//google user token validating api
LoginWithGoogle(credential: string){
  
    return this.http.post(this.BASEURL+ "Authentication/LoginWithGoogle/"+credential, { });
}



}
