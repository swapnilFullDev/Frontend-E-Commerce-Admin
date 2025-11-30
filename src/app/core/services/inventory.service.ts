import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { InventoryItem } from "../models/inventory.interface";

@Injectable({
  providedIn: "root",
})
export class InventoryService {
  httpClient = inject(HttpClient);

  getAll(): Observable<InventoryItem[]> {
    return this.httpClient.get<InventoryItem[]>(`${environment.API_URL}${environment.inventoryMiddleWare}`);
  }

  getById(id: number): Observable<InventoryItem> {
    return this.httpClient.get<InventoryItem>(`${environment.API_URL}${environment.inventoryMiddleWare}/${id}`);
  }

  create(item: InventoryItem): Observable<InventoryItem> {
    return this.httpClient.post<InventoryItem>(`${environment.API_URL}${environment.inventoryMiddleWare}`, item);
  }

  update(id: number, item: InventoryItem): Observable<InventoryItem> {
    return this.httpClient.put<InventoryItem>(
      `${environment.API_URL}${environment.inventoryMiddleWare}/${id}`,
      item
    );
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${environment.API_URL}${environment.inventoryMiddleWare}/${id}`);
  }

  toggleInventoryItem(inventoryId:number,field:string){
    return this.httpClient.patch(`${environment.API_URL}${environment.inventoryMiddleWare}/toggle/${inventoryId}`,{field:field});
  }
}
