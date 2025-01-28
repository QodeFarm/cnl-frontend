
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  // Form data object for binding
  formData = {
    old_password: '',
    password: '',
    confirm_password: ''
  };

  // Visibility toggles for the password fields
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Messages for UI feedback
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  // Handle form submission
  onSubmit(): void {
    this.successMessage = null;
    this.errorMessage = null;

    // Validate passwords locally
    if (this.formData.password !== this.formData.confirm_password) {
      this.errorMessage = "Password and Confirm Password do not match.";
      this.autoHideMessage();
      return;
    }

    // Call the API
    this.changePassword(this.formData).subscribe(
      (response) => {
        this.successMessage = "Password changed successfully!";
        this.errorMessage = null; // Clear error message
        this.resetForm(); // Reset form fields
        this.autoHideMessage(); // Automatically hide success message
      },
      (error) => {
        if (error.error?.errors) {
          this.errorMessage = this.formatErrorMessage(error.error.errors); // API validation errors
        } else {
          this.errorMessage = "An error occurred while changing the password.";
        }
        this.successMessage = null; // Clear success message
        this.autoHideMessage(); // Automatically hide error message
      }
    );
  }
  autoHideMessage(): void {
    setTimeout(() => {
      this.successMessage = null;
      this.errorMessage = null;
    }, 5000); // 5000ms = 5 seconds
  }

  // Call the API to change the password
  changePassword(data: any): Observable<any> {
    const apiUrl = 'users/change_password/'; // Backend API endpoint
    return this.http.post(apiUrl, data);
  }

  // Format API validation error messages
  formatErrorMessage(errors: any): string {
    const errorMessages = [];
    for (const field in errors) {
      if (errors[field]) {
        errorMessages.push(`${field}: ${errors[field].join(', ')}`);
      }
    }
    return errorMessages.join('. ');
  }

  // Reset form after successful password change
  resetForm(): void {
    this.formData = {
      old_password: '',
      password: '',
      confirm_password: ''
    };
  }

  // Toggle visibility for password fields
  toggleVisibility(field: string): void {
    if (field === 'old') {
      this.showOldPassword = !this.showOldPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
