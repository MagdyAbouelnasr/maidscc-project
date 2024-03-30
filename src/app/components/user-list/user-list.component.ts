import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../../services/user.service';
import { UserInterface } from '../../models/user';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent,
} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatPaginatorModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  isLoading: boolean = true;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  cols$!: Observable<number>;
  rowHeight$!: Observable<number | string>;
  allFetchedUsers: UserInterface[] = [];
  pageSlice: UserInterface[] = [];
  pageSize: number = 6;
  currentPage: number = 1;
  totalUsersCount = 0;
  userService = inject(UserService);
  fetchedPages = new Set<number>();

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers(1);
  }

  fetchUsers(page: number): void {
    this.isLoading = true; // Start loading
    if (!this.fetchedPages.has(page)) {
      this.userService
        .getUsers(page)
        .then((users) => {
          this.allFetchedUsers = [...this.allFetchedUsers, ...users];
          this.pageSlice = users;
          this.fetchedPages.add(page);

          if (users.length < this.pageSize) {
            this.totalUsersCount = this.allFetchedUsers.length;
          } else {
            this.totalUsersCount = Math.max(
              this.totalUsersCount,
              (page + 1) * this.pageSize
            );
          }
          this.isLoading = false;
        })
        .catch((error) => {
          console.error('Error fetching users:', error);
          this.isLoading = false;
        });
    } else {
      // If the page is already fetched, just update the pageSlice from allFetchedUsers
      const start = (page - 1) * this.pageSize;
      const end = start + this.pageSize;
      this.pageSlice = this.allFetchedUsers.slice(start, end);
      this.isLoading = false;
    }
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex + 1;
    this.pageSize = pageEvent.pageSize;

    if (!this.fetchedPages.has(this.currentPage)) {
      this.fetchUsers(this.currentPage);
    } else {
      const startIndex = (this.currentPage - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.pageSlice = this.allFetchedUsers.slice(startIndex, endIndex);
    }
  }

  onSearch(searchValue: string): void {
    if (!searchValue.trim()) {
      this.currentPage = 1;

      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }

      const startIndex = (this.currentPage - 1) * this.pageSize;
      this.pageSlice = this.allFetchedUsers.slice(
        startIndex,
        startIndex + this.pageSize
      );
      this.totalUsersCount = this.allFetchedUsers.length + 6;
    } else {
      if (this.paginator && this.currentPage !== 1) {
        this.paginator.pageIndex = 0;
      }
      this.currentPage = 1;
      const searchId = parseInt(searchValue.trim(), 10);
      const filteredUsers = this.allFetchedUsers.filter(
        (user) => user.id === searchId
      );
      this.pageSlice = filteredUsers.slice(0, this.pageSize);
      this.totalUsersCount = filteredUsers.length;
    }
  }

  userDetail(userId: number): void {
    console.log(userId)
    this.router.navigate([`users/${userId}`]);
  }
}
