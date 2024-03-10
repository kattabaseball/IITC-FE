export class ProductDto {
    id?: number;
    name?: string;
    description?: string;
    quantity?: string;
    amount?: number;
    inStock?: number;
}

export class PaginationDto {
    pageNumber?: number = 1;
    itemsPerPage?: number = 100;
    searchText?: string;
    
}


export class PaginatedProductList {
    products?: ProductDto[];
    currentPage?: any;
    totalCount?: number;
    itemsPerPage?: number;
}

