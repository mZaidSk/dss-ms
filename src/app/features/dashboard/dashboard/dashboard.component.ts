import { Component, ViewChild } from '@angular/core';
import { DashboardService } from '../../../shared/services/dashboard/dashboard.service';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'], // Note the plural "styleUrls"
})
export class DashboardComponent {
  @ViewChild(BaseChartDirective) chart!: BaseChartDirective;

  numberOfWatchmen: number = 0;
  numberOfBuildings: number = 0;
  numberOfWatchmenAssignments: number = 0;
  numberOfFeedback: number = 0;

  public chartData: ChartData = {
    labels: ['Watchmen', 'Buildings', 'Assigned Watchmen', 'Feedback'],
    datasets: [
      {
        data: [0, 0, 0, 0], // Initial placeholder data
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)', // Blue
          'rgba(75, 192, 192, 0.2)', // Green
          'rgba(255, 159, 64, 0.2)', // Orange
          'rgba(153, 102, 255, 0.2)', // Purple
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit() {
    this.dashboardService.getNumberOfBuildings().subscribe((count) => {
      this.numberOfBuildings = count;
      this.updateChartData();
    });

    this.dashboardService.getNumberOfWatchman().subscribe((count) => {
      this.numberOfWatchmen = count;
      this.updateChartData();
    });

    this.dashboardService
      .getNumberOfWatchmanAssignments()
      .subscribe((count) => {
        this.numberOfWatchmenAssignments = count;
        this.updateChartData();
      });

    this.dashboardService.getNumberOfFeedback().subscribe((count) => {
      this.numberOfFeedback = count;
      this.updateChartData();
    });
  }

  private updateChartData() {
    this.chartData.datasets[0].data = [
      this.numberOfWatchmen,
      this.numberOfBuildings,
      this.numberOfWatchmenAssignments,
      this.numberOfFeedback,
    ];

    if (this.chart) {
      this.chart.update();
    }
  }
}
