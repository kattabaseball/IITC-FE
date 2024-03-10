import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { LoginDto } from '../Dto/LoginDto';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{

  loginFG: FormGroup;
  hide = true;

    constructor(public fb: FormBuilder, public loginService: LoginService, public snackbar: MatSnackBar, 
      public router: Router, private _ngZone: NgZone) {
      
        //this is the forming of the login form group
      this.loginFG = this.fb.group({
        username: fb.control('', [Validators.required]),
        password: fb.control('', [Validators.required])
      });
        
    
  }
  ngOnInit(): void {

  //below is the code for google authentication
    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
          client_id: '1008681447232-u9lf637ejn2gftt00n3b2u88kef36ll0.apps.googleusercontent.com',
          callback: this.handleCredentialResponse.bind(this),
          auto_select: false,
          cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
        // @ts-ignore
        document.getElementById("buttonDiv"),
        { theme: "outline", size: "large" , width: "350px"}
      );
        // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    }

  }
//below code check if the token is valid from the backend
  async handleCredentialResponse(response: CredentialResponse){
    await this.loginService.LoginWithGoogle(response.credential).subscribe(
      (x:any) => {
        localStorage.setItem('access_token', x.data.token); 
        this._ngZone.run(()=>{
          this.router.navigate(['productHome'])
        })},
        (error: any) => {
            console.log(error);
            
        }
    );
  }

//in this login method it takes the user names and password and sends it to the backend to be authenticated and return the token
//it it is a success it will be redirected to the product home page if not a snackbar will be poped 
  login(){

    let login: LoginDto = {
        username: this.loginFG.get('username')?.value,
        password: this.loginFG.get('password')?.value
    };

    this.loginService.loginApi(login).subscribe(result => {
      if(result.status == 'Success')
      {
        localStorage.setItem('access_token', result.data.token);        
        this.openSnackBar(result.message, result.status, 10000);
        this.router.navigate(['productHome']);         

      }
      else
      {
        this.openSnackBar(result.message, result.status, 10000); 

      }
        
    });

  
}

//snackbar method

openSnackBar(msg: any, status: any, time: any){

  var horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  var verticalPosition: MatSnackBarVerticalPosition = 'top';

  this.snackbar.open(msg, status, {
    horizontalPosition: horizontalPosition,
    verticalPosition: verticalPosition,
    duration: time,
    panelClass: ['snackbar-2']
});
  
}



}
