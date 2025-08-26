import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-activation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './activation.component.html',
  styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {
  title: string = 'Verifying...';
  message: string = 'Please wait while we verify your activation code.';
  status: 'success' | 'error' | 'info' = 'info';

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const { uid, token } = this.route.snapshot.params;
    
    if (!uid || !token) {
      this.handleError('Invalid activation link.');
      return;
    }

    this.activateAccount(uid, token);
  }

  private activateAccount(uid: string, token: string): void {
    const payload = { uid, token };

    this.http.post(`users/activation/${uid}/${token}/`, payload)
      .subscribe({
        next: (res: any) => {
          if (res.count === '1') {
            if (res.data?.isActive) {
              if (res.data.status === 'info') {
                this.handleAlreadyActivated();
              } else {
                this.handleSuccess();
              }
            } else {
              this.handleError(res.msg || 'Activation failed.');
            }
          } else {
            this.handleError('Activation failed.');
          }
        },
        error: (error) => {
          this.handleError(error.error?.msg || 'Invalid activation link or the link has expired.');
        }
      });
  }

  private handleSuccess(): void {
    this.status = 'success';
    this.title = 'Activation Successful!';
    this.message = 'Your account has been successfully activated.';
  }

  private handleAlreadyActivated(): void {
    this.status = 'info';
    this.title = 'Already Activated';
    this.message = 'This account has already been activated. You can proceed to login.';
  }

  private handleError(msg: string): void {
    this.status = 'error';
    this.title = 'Activation Failed';
    this.message = msg;
  }

  getAlertClass(): string {
    const alertClasses = {
      'success': 'alert alert-success',
      'error': 'alert alert-danger',
      'info': 'alert alert-info'
    };
    return alertClasses[this.status] || alertClasses.info;
  }

  getIconClass(): string {
    const iconClasses = {
      'success': 'fas fa-check-circle fa-3x',
      'error': 'fas fa-times-circle fa-3x',
      'info': 'fas fa-info-circle fa-3x'
    };
    return iconClasses[this.status] || iconClasses.info;
  }
}