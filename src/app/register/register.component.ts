import { Component, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadPopupComponent } from '../Popups/upload-popup/upload-popup.component';
import { RegisterUserDto } from '../Dto/RegisterUserDto';
import { LoginService } from '../login/login.service';
import { RegisterService } from './register.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  regFG : FormGroup;

  username?: string;
  email?: string;
  contactNumber?: string;
  password?:string;
  hide = true;


  // validationMessages = {
  //   'username': [{ type: 'required', message: 'User name is required' }],
  //   'email': [{ type: 'required', message: 'Email is required'}, { type: 'email', message: 'Enter a valid email'}],
  //   'contactNumber': [{ type: 'required', message: 'Contact Number is required' }, { type: 'pattern', message: 'Contact Number is invalid' }],
  //   'password': [{ type: 'required', message: 'Password is required'}]
  // }

  constructor(public fb: FormBuilder, public registerService: RegisterService, public snackbar: MatSnackBar,
   private _ngZone: NgZone, private router:Router) {

    //form grp of register and its validations
      this.regFG = this.fb.group({
        username: new FormControl(this.username, [Validators.required]),
        email: new FormControl(this.email, [Validators.required, Validators.email]),
        contactNumber: new FormControl(this.contactNumber, [Validators.required, Validators.pattern("^[0-9]{9}")]),
        password: new FormControl(this.password, [Validators.required, Validators.pattern("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+-]).{8,16}")]),
      });

      
  }

  registerUser(){

    //typed data in the form will be fetched and will be sent to the be to be registered
    let register: RegisterUserDto = {
      userName: this.regFG.get('username')?.value,
      email: this.regFG.get('email')?.value,
      contactNumber: this.regFG.get('contactNumber')?.value,
      password : this.regFG.get('password')?.value
  };

    this.registerService.RegisterUser(register).subscribe(result => {

        if(result.status == "Success")
        {
          this.regFG.reset();
       
          this.openSnackBar("User created succesfully.", result.status, 10000); 
        }
        else{
          this.openSnackBar("User creation unsuccessfull", result.status, 10000); 
        }

    });

  }

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

  //if the cancel is pressed will route to login page and be refresed
  cancel(){
    this._ngZone.run(() => {
      this.router.navigate(['login']).then(() => window.location.reload());
    })
  }

  


  

}
