import { Injectable, inject, signal } from '@angular/core';
import { UserInterface } from '../models/user';
import { Observable, lastValueFrom, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  private usersCache = new Map<number, UserInterface[]>();

  constructor() {}
  async getUsers(page: number): Promise<UserInterface[]> {
    // Check if the page is already in the cache
    if (this.usersCache.has(page)) {
      return this.usersCache.get(page)!;
    }

    try {
      const response = await fetch(`https://reqres.in/api/users?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const jsonResponse = await response.json();
      const users = jsonResponse.data ?? [];
      // Cache the fetched users
      this.usersCache.set(page, users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  }

  getUserById(id: string): Observable<UserInterface> {
    return this.http
      .get<{ data: UserInterface }>(`https://reqres.in/api/users/${id}`)
      .pipe(map((response) => response.data));
  }
}
