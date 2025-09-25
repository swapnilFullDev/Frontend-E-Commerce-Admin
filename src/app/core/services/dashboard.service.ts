import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardStats, ChartData } from '../models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  getDashboardStats(): Observable<DashboardStats> {
    const stats: DashboardStats = {
      totalUsers: 1247,
      totalProducts: 856,
      totalOrders: 2341,
      totalRevenue: 125673.50,
      userGrowth: 12.5,
      productGrowth: 8.2,
      orderGrowth: 15.7,
      revenueGrowth: 18.3
    };
    
    return of(stats).pipe(delay(500));
  }

  getBarChartData(): Observable<ChartData> {
    const data: ChartData = {
      series: [
        {
          name: 'Revenue',
          data: [31000, 40000, 35000, 50000, 45000, 60000, 55000, 65000, 70000, 75000, 80000, 85000]
        }
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    return of(data).pipe(delay(300));
  }

  getLineChartData(): Observable<ChartData> {
    const data: ChartData = {
      series: [
        {
          name: 'Users',
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 187, 234, 278]
        },
        {
          name: 'Orders',
          data: [5, 23, 18, 32, 28, 41, 45, 67, 89, 123, 156, 189]
        }
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    return of(data).pipe(delay(300));
  }

  getPieChartData(): Observable<ChartData> {
    const data: ChartData = {
      series: [44, 55, 13, 43],
      labels: ['Electronics', 'Clothing', 'Books', 'Home & Garden']
    };
    
    return of(data).pipe(delay(300));
  }

  getAreaChartData(): Observable<ChartData> {
    const data: ChartData = {
      series: [
        {
          name: 'Products Sold',
          data: [31, 40, 28, 51, 42, 109, 100, 87, 95, 102, 115, 128]
        }
      ],
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    
    return of(data).pipe(delay(300));
  }
}