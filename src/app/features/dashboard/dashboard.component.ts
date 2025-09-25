import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgApexchartsModule } from 'ng-apexcharts';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats, ChartData } from '../../core/models/dashboard.interface';
import { LoadingComponent } from '../../shared/components/loading/loading.component';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexFill
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  legend?: ApexLegend;
  fill?: ApexFill;
  labels?: any;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    NgApexchartsModule,
    LoadingComponent,
    NgApexchartsModule
  ],
  templateUrl: "./dashboard.html"
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  isLoading = true;

  barChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'bar', height: 300 },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: [] },
    dataLabels: { enabled: false },
    yaxis: { title: { text: 'Revenue (₹)' } }
  };

  lineChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'line', height: 300 },
    xaxis: { categories: [] },
    dataLabels: { enabled: false }
  };

  pieChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'pie', height: 300 },
    labels: [],
    legend: { position: 'bottom' },
    xaxis: { categories: [] },
    dataLabels: { enabled: false }
  };

  areaChartOptions: ChartOptions = {
    series: [],
    chart: { type: 'area', height: 300 },
    xaxis: { categories: [] },
    dataLabels: { enabled: false },
    fill: { type: 'gradient' }
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  private loadDashboardData(): void {
    this.isLoading = true;
    
    // Load stats
    this.dashboardService.getDashboardStats().subscribe(stats => {
      this.stats = stats;
    });

    // Load charts
    this.dashboardService.getBarChartData().subscribe(data => {
      this.barChartOptions.series = data.series;
      this.barChartOptions.xaxis = { ...this.barChartOptions.xaxis, categories: data.categories };
    });

    this.dashboardService.getLineChartData().subscribe(data => {
      this.lineChartOptions.series = data.series;
      this.lineChartOptions.xaxis = { ...this.lineChartOptions.xaxis, categories: data.categories };
    });

    this.dashboardService.getPieChartData().subscribe(data => {
      this.pieChartOptions.series = data.series;
      this.pieChartOptions.labels = data.labels;
    });

    this.dashboardService.getAreaChartData().subscribe(data => {
      this.areaChartOptions.series = data.series;
      this.areaChartOptions.xaxis = { ...this.areaChartOptions.xaxis, categories: data.categories };
      this.isLoading = false;
    });
  }
}