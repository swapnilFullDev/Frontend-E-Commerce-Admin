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
}