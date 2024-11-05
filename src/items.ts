export interface Product {
    id : number, rating : number, status : string, product_id : string;
}

export interface CreateProduct {
    rating : number, status : string, product_id : string;
}