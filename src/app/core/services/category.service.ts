import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { delay, map } from "rxjs/operators";
import { Category } from "../models/category.interface";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class CategoryService {
  private httpClient = inject(HttpClient);
  constructor() { }


  getCategories(pageNo:number,limit:number,search:string): Observable<any> {
    return this.httpClient
      .get<any>(`${environment.API_URL}${environment.categoryMiddleWare}?page=${pageNo}&limit=${limit}&q=${search}`)
      .pipe(
        map((res) => ({
          categories: res.data.map((item: any) => ({
            id: item.ID,
            name: item.Name,
            image: item.Image,
            icon: item.Icon,
            parentId: item.Parent_ID,
            status: item.Status,
            createdAt: item.Created_At,
            updatedAt: item.Updated_At,
          })),
          pagination: {
            total: res.pagination.total,
            page: res.pagination.page,
            limit: res.pagination.limit,
            totalPages: res.pagination.totalPages
          }
        }))
    )
  }

  createCategory(category:any): Observable<any> {
    return this.httpClient.post(`${environment.API_URL}${environment.categoryMiddleWare}`,category);
  }

  deleteCategory(categoryId:number):Observable<any>{
    return this.httpClient.delete(`${environment.API_URL}${environment.categoryMiddleWare}/${categoryId}`);
  }

  //   updateProduct(id: number, product: Partial<any>): Observable<any> {
  //     const currentProducts = this.productsSubject.value;
  //     const productIndex = currentProducts.findIndex((p) => p.id === id);

  //     if (productIndex !== -1) {
  //       const updatedProduct = { ...currentProducts[productIndex], ...product };
  //       currentProducts[productIndex] = updatedProduct;
  //       this.productsSubject.next([...currentProducts]);
  //       return of(updatedProduct).pipe(delay(500));
  //     }

  //     throw new Error("Product not found");
  //   }

  //   deleteProduct(id: number): Observable<boolean> {
  //     const currentProducts = this.productsSubject.value;
  //     const filteredProducts = currentProducts.filter((p) => p.id !== id);
  //     this.productsSubject.next(filteredProducts);

  //     return of(true).pipe(delay(500));
  //   }

  //   approveProduct(id: number, comments?: string): Observable<boolean> {
  //     return this.updateProduct(id, { isApproved: true }).pipe(map(() => true));
  //   }

  //   rejectProduct(id: number, comments: string): Observable<boolean> {
  //     return this.deleteProduct(id);
  //   }
}
