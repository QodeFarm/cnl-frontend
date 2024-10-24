import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userId: string | null = null;
  private username: string | null = null;
  private firstName: string | null = null;
  private lastName: string | null = null;

  constructor() { }

  // Set userId, username , first_name, last_name
  setUserDetails(userId: string, username: string, firstName: string, lastName: string): void {
    this.userId = userId;
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);

    // Log to verify the details being set
    console.log('UserService: setUserDetails called');
    console.log('User ID:', this.userId);
    console.log('Username:', this.username);
    console.log('First Name:', this.firstName);
    console.log('Last Name:', this.lastName);
  }

  // Get userId
  getUserId(): string | null {
    const storedUserId = this.userId || localStorage.getItem('userId');
    console.log('UserService: getUserId called, returning:', storedUserId);
    return storedUserId;
  }

  // Get username
  getUsername(): string | null {
    const storedUsername = this.username || localStorage.getItem('username');
    console.log('UserService: getUsername called, returning:', storedUsername);
    return storedUsername;
  }

    // Get first name
    getFirstName(): string | null {
      const storedFirstName = this.firstName || localStorage.getItem('firstName');
      console.log('UserService: getFirstName called, returning:', storedFirstName);
      return storedFirstName;
    }
  
    // Get last name
    getLastName(): string | null {
      const storedLastName = this.lastName || localStorage.getItem('lastName');
      console.log('UserService: getLastName called, returning:', storedLastName);
      return storedLastName;
    }

  // Clear user details
  clearUserDetails(): void {
    console.log('UserService: clearUserDetails called');
    this.userId = null;
    this.username = null;
    this.firstName = null;
    this.lastName = null;
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  }
}
