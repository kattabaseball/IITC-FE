import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UploadPopupComponent } from '../Popups/upload-popup/upload-popup.component';
import { LoginService } from '../login/login.service';
import { Route, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PaginatedProductList, PaginationDto, ProductDto } from '../Dto/ProductDto';
import { ProductService } from './product.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-product-home',
  templateUrl: './product-home.component.html',
  styleUrl: './product-home.component.scss'
})
export class ProductHomeComponent implements OnInit {

  displayedColumns: string[] = ['productName', 'productDescription', 'productQty', 'productAmount', 'productInStock'];
  uploadedUrl?: string;
  userName: string | undefined;
  pageEvent?: PageEvent;


  dataSource = new MatTableDataSource<ProductDto>();
  //Pagination.
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  // MatPaginator Inputs
  length: number | undefined;
  pageSize: number = 30;
  pageIndex = 1;
  totalPageCount = 0;
  // pageSizeOptions: number[] = [10, 100, 200];
  productList?: PaginatedProductList;
  searchText?: string;


  constructor(public dialog: MatDialog, public loginService: LoginService, public router: Router,
    public snackbar: MatSnackBar, private _ngZone: NgZone, public productService: ProductService) {

      //very first thing that happens when the component loads will be the calling of local storage tokens decided data
    var decodedData = this.loginService.getUserInfo();
    this.userName = decodedData?.userName;
  }
  ngOnInit(): void {
    //get all products will be called everytime the component is loaded
    this.getAllProduct(this.pageIndex, this.pageSize, this.searchText);
  }

  //opens the pdf upload component in a dialogbox
  UploadPdf() {
    const dialogRef = this.dialog.open(UploadPopupComponent, {
      width: '512px',
      height: '364px',

    });

    //once the dialog box is closed and its return value is true getAllProducts will be axcecuted and the latest added record will be shown
    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        this.getAllProduct(1, this.pageSize, this.searchText);
      }

    });
  }

  //this will remove the token from local storage
  logOut() {
    localStorage.removeItem("access_token");
    this.openSnackBar("Logged out successful", "Success", 10000);
    this._ngZone.run(() => {
      this.router.navigate(['login']).then(() => window.location.reload());
    })


  }


  openSnackBar(msg: any, status: any, time: any) {

    var horizontalPosition: MatSnackBarHorizontalPosition = 'right';
    var verticalPosition: MatSnackBarVerticalPosition = 'top';

    this.snackbar.open(msg, status, {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: time,
      panelClass: ['snackbar-2']
    });

  }

//this will get the current page number and items per page tand will be sent t=with the search text to the be
  search(){

    let pagination: PaginationDto = {
      pageNumber: this.pageIndex,
      itemsPerPage: this.pageSize,
      
    };

    this.getAllProduct(1, this.pageSize, this.searchText);
    
  }


  getAllProduct(pagenum: number, itemPerPage: number, searchText: any) {
    let pagination: PaginationDto = {
      pageNumber: pagenum,
      itemsPerPage: itemPerPage,
      searchText: searchText
    };

    this.length = 0;
    this.productService.GetAllProducts(pagination).subscribe(result => {
      if (result) {
        this.productList = result;
        this.length = this.productList?.totalCount;

      }

      this.refreshGrid(this.productList?.products);

      this.pageIndex = result.currentPage - 1;
    });
  }

  //datasource will be refreshed here any time a new change happen to the datasource list i will call this
  refreshGrid(data: any) {

    this.dataSource = new MatTableDataSource<ProductDto>(data);
    this.dataSource.paginator = this.paginator;

  }

  //im calling this whenever the page changes
  onPageChanged(e: PageEvent) {
    this.pageIndex = e.pageIndex + 1;
    this.pageSize = e.pageSize;

    this.getAllProduct(this.pageIndex, this.pageSize, this.searchText);

  }



}
