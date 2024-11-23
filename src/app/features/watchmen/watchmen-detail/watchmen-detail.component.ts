import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { watchmenService } from '../../../shared/services/watchmen/watchmen.service'; // Import your service
import { watchmen } from '../../../shared/models/watchmen.model';
import { Observable } from 'rxjs';
import { LoadingComponent } from "../../../core/components/loading/loading.component";

@Component({
  selector: 'app-watchmen-detail',
  standalone: true,
  imports: [CommonModule, LoadingComponent],
  templateUrl: './watchmen-detail.component.html',
  styleUrls: ['./watchmen-detail.component.scss']
})
export class watchmenDetailComponent implements OnInit {
  watchmenId?: string; // ID from the route
  watchmen$!: Observable<watchmen>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private watchmenService: watchmenService // Inject watchmenService
  ) { }

  ngOnInit(): void {
    // Get the watchmenId from the route
    this.watchmenId = this.route.snapshot.paramMap.get('watchmenId') || '';

    if (this.watchmenId) {
      // Fetch watchmen details by ID
      this.fetchwatchmenDetails(this.watchmenId);
    }
  }

  private fetchwatchmenDetails(watchmenId: string): void {
    this.watchmen$ = this.watchmenService.getwatchmenById(watchmenId);
  }

  onEditwatchmen(): void {
    if (this.watchmenId) {
      this.router.navigate([`/watchmen/edit/${this.watchmenId}`]);
    }
  }

}
