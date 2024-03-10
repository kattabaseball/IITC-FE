import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../../product-home/product.service';

@Component({
  selector: 'app-upload-popup',
  templateUrl: './upload-popup.component.html',
  styleUrl: './upload-popup.component.scss'
})
export class UploadPopupComponent {

  files: File[] = [];

  constructor(private snackBar: MatSnackBar,public dialogRef : MatDialogRef<UploadPopupComponent>,
    public productService: ProductService) {}
 
    //file will be added to a list
  onFileSelected(event: any) {
     this.files.push(event.target.files[0]);
  }
 
  // in here it will check if it is csv file if not it will return snackbar to upload a csv 
  //if a file is uploaded it will be sent to the backend and if the result is true the popup will be closed
   uploadFiles() {
     if (this.files.length > 0 && this.files[0].name.endsWith('.csv')) {
       this.snackBar.open('Files uploaded successfully.', 'OK', {
         duration: 3000,
       });
         this.productService.uploadCSVFile(this.files[0]).subscribe(result => {
          if(result){
            this.files = [];
             this.dialogRef.close(true);
          }
        })

       
     } else {
       this.snackBar.open('Please select a csv file to upload.', 'OK', {
         duration: 3000,
       });
     }
  }
 
  cancel() {
     this.files = [];
  }



}
