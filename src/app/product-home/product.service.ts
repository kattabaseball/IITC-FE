import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PaginatedProductList, PaginationDto, ProductDto } from '../Dto/ProductDto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  BASEURL = "https://localhost:7073/api/";

  constructor(public http: HttpClient) { }

  //api to get all products
  GetAllProducts(pagination: PaginationDto): Observable<PaginatedProductList> {
    return this.http.post<PaginatedProductList>(this.BASEURL + "Product/GetAllProducts", pagination, {});

  }

  //file sending api
  uploadCSVFile(file: File): Observable<any> {
    const formData: FormData = new FormData();
   formData.append('file', file, file.name);
    return this.http.post<any> (this.BASEURL + "Product/UploadCSV", formData)
  }
}
