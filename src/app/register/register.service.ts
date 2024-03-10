import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterUserDto } from '../Dto/RegisterUserDto';
import { Observable } from 'rxjs';
import { ApiResponseDto } from '../Dto/ApiResponseDto';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  BASEURL = "https://localhost:7073/api/";

  constructor(public http: HttpClient) { }

  //register user api
  public RegisterUser(newUser: RegisterUserDto) : Observable<ApiResponseDto>{

    return this.http.post<ApiResponseDto>(this.BASEURL + "Authentication/CreateUser", newUser);

  }
}
