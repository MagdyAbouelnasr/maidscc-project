import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../models/user';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss',
})
export class UserDetailsComponent {
  user!: UserInterface;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.fetchUserDetails(userId);
    } else {
      this.goBack();
    }
  }

  fetchUserDetails(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (userData) => {
        this.user = userData;
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
