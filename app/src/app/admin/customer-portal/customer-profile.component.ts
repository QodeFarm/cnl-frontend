import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-container">
      <!-- Cover Image -->
      <div class="profile-cover">
        <div class="cover-gradient"></div>
      </div>

      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <div class="avatar-circle">
            {{ getInitials(customerData?.name) }}
          </div>
        </div>
        <div class="profile-title">
          <h1>{{ customerData?.name || 'Customer Name' }}</h1>
          <p class="customer-code">Customer Code: {{ customerData?.code || 'N/A' }}</p>
          <div class="badge" *ngIf="customerData?.is_portal_user">
            <i class="fas fa-check-circle"></i> Active Member
          </div>
        </div>
        <div class="profile-actions">
          <button class="btn-edit" (click)="editProfile()" *ngIf="!isEditing">
            <i class="fas fa-edit"></i> Edit Profile
          </button>
          <button class="btn-save" (click)="saveProfile()" *ngIf="isEditing">
            <i class="fas fa-save"></i> Save Changes
          </button>
          <button class="btn-cancel" (click)="cancelEdit()" *ngIf="isEditing">
            <i class="fas fa-times"></i> Cancel
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading profile...</p>
      </div>

      <!-- Profile Content -->
      <div class="profile-content" *ngIf="!loading && customerData">
        <!-- Quick Info Cards -->
        <div class="info-cards">
          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-calendar-alt"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Member Since</span>
              <span class="card-value">{{ customerData.registration_date | date:'MMM d, y' }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-credit-card"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Credit Limit</span>
              <span class="card-value">{{ (customerData.credit_limit || 0) | currency:'INR' }}</span>
            </div>
          </div>
          <div class="info-card">
            <div class="card-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="card-content">
              <span class="card-label">Last Login</span>
              <span class="card-value">{{ customerData.last_login | date:'medium' }}</span>
            </div>
          </div>
        </div>

        <div class="profile-grid">
          <!-- Personal Information -->
          <div class="profile-section">
            <div class="section-header">
              <i class="fas fa-user-circle"></i>
              <h2>Personal Information</h2>
            </div>
            <div class="section-content">
              <div class="info-row">
                <div class="info-label">Full Name</div>
                <div class="info-value" *ngIf="!isEditing">{{ customerData.name }}</div>
                <input *ngIf="isEditing" type="text" [(ngModel)]="editedCustomer.name" class="edit-input">
              </div>
              <div class="info-row">
                <div class="info-label">Username</div>
                <div class="info-value">{{ customerData.username }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">Customer Code</div>
                <div class="info-value">{{ customerData.code }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">GST Number</div>
                <div class="info-value">{{ customerData.gst || 'Not provided' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">PAN Number</div>
                <div class="info-value">{{ customerData.pan || 'Not provided' }}</div>
              </div>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="profile-section">
            <div class="section-header">
              <i class="fas fa-address-card"></i>
              <h2>Contact Information</h2>
            </div>
            <div class="section-content">
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-envelope"></i> Email
                </div>
                <div class="info-value">{{ contactInfo.email || 'Not provided' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-phone"></i> Phone
                </div>
                <div class="info-value">{{ contactInfo.phone || 'Not provided' }}</div>
              </div>
              <div class="info-row">
                <div class="info-label">
                  <i class="fas fa-globe"></i> Website
                </div>
                <div class="info-value">{{ customerData.website || 'Not provided' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Addresses Section -->
        <div class="addresses-section">
          <div class="section-header">
            <i class="fas fa-map-marker-alt"></i>
            <h2>Your Addresses</h2>
          </div>
          <div class="addresses-grid">
            <!-- Billing Address -->
            <div class="address-card" *ngIf="billingAddress">
              <div class="address-badge billing">
                <i class="fas fa-home"></i> Billing Address
              </div>
              <div class="address-content">
                <p class="address-line">{{ formatAddress(billingAddress) }}</p>
                <div class="address-contact" *ngIf="billingAddress.phone">
                  <i class="fas fa-phone"></i> {{ billingAddress.phone }}
                </div>
                <div class="address-contact" *ngIf="billingAddress.email">
                  <i class="fas fa-envelope"></i> {{ billingAddress.email }}
                </div>
              </div>
            </div>
            <div class="address-card" *ngIf="!billingAddress && customerAddresses && customerAddresses.length === 0">
              <div class="address-badge billing">
                <i class="fas fa-home"></i> Billing Address
              </div>
              <div class="address-content">
                <p class="address-line">No billing address found</p>
              </div>
            </div>

            <!-- Shipping Address -->
            <div class="address-card" *ngIf="shippingAddress">
              <div class="address-badge shipping">
                <i class="fas fa-truck"></i> Shipping Address
              </div>
              <div class="address-content">
                <p class="address-line">{{ formatAddress(shippingAddress) }}</p>
                <div class="address-contact" *ngIf="shippingAddress.phone">
                  <i class="fas fa-phone"></i> {{ shippingAddress.phone }}
                </div>
                <div class="address-contact" *ngIf="shippingAddress.email">
                  <i class="fas fa-envelope"></i> {{ shippingAddress.email }}
                </div>
              </div>
            </div>
            <div class="address-card" *ngIf="!shippingAddress && customerAddresses && customerAddresses.length === 0">
              <div class="address-badge shipping">
                <i class="fas fa-truck"></i> Shipping Address
              </div>
              <div class="address-content">
                <p class="address-line">No shipping address found</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    /* Cover Image */
    .profile-cover {
      height: 200px;
      background: linear-gradient(135deg, #224385 0%, #764ba2 100%);
      border-radius: 20px 20px 0 0;
      position: relative;
      margin-bottom: 80px;
    }

    .cover-gradient {
      position: absolute;
      inset: 0;
      background: linear-gradient(45deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9));
      border-radius: 20px 20px 0 0;
    }

    /* Profile Header */
    .profile-header {
      display: flex;
      align-items: center;
      gap: 30px;
      margin-top: -80px;
      margin-bottom: 30px;
      padding: 0 30px;
      flex-wrap: wrap;
    }

    .profile-avatar {
      position: relative;
    }

    .avatar-circle {
      width: 120px;
      height: 120px;
      background: linear-gradient(135deg, #224385, #764ba2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      font-weight: 600;
      color: white;
      border: 4px solid white;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .profile-title {
      flex: 1;
    }

    .profile-title h1 {
      margin: 0 0 5px 0;
      font-size: 28px;
      font-weight: 600;
      color: #333;
    }

    .customer-code {
      margin: 0 0 10px 0;
      color: #666;
      font-size: 14px;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 5px 12px;
      background: #e6f7e6;
      color: #2e8b57;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }

    .badge i {
      font-size: 12px;
    }

    .profile-actions {
      display: flex;
      gap: 10px;
    }

    .btn-edit, .btn-save, .btn-cancel {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .btn-edit {
      background: #224385;
      color: white;
    }

    .btn-edit:hover {
      background: #5a67d8;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .btn-save {
      background: #2e8b57;
      color: white;
    }

    .btn-save:hover {
      background: #3c9c66;
    }

    .btn-cancel {
      background: #f1f5f9;
      color: #64748b;
    }

    .btn-cancel:hover {
      background: #e2e8f0;
    }

    /* Loading State */
    .loading-state {
      text-align: center;
      padding: 60px;
      background: white;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .spinner {
      display: inline-block;
      width: 40px;
      height: 40px;
      border: 3px solid #f1f5f9;
      border-top-color: #224385;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Profile Content */
    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 30px;
    }

    /* Info Cards */
    .info-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 10px;
    }

    .info-card {
      background: white;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s;
    }

    .info-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);
    }

    .card-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #224385, #764ba2);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }

    .card-content {
      display: flex;
      flex-direction: column;
    }

    .card-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }

    .card-value {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    /* Profile Grid */
    .profile-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
    }

    .profile-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f1f5f9;
    }

    .section-header i {
      font-size: 20px;
      color: #224385;
    }

    .section-header h2 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .section-content {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .info-row {
      display: flex;
      align-items: baseline;
      padding: 5px 0;
    }

    .info-label {
      width: 120px;
      font-size: 14px;
      color: #666;
    }

    .info-value {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .info-label i {
      width: 20px;
      margin-right: 5px;
      color: #224385;
    }

    .edit-input {
      flex: 1;
      padding: 8px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.2s;
    }

    .edit-input:focus {
      outline: none;
      border-color: #224385;
    }

    /* Addresses Section */
    .addresses-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .addresses-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .address-card {
      background: #f8fafc;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid #f0f0f0;
      transition: all 0.2s;
    }

    .address-card:hover {
      border-color: #224385;
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.1);
    }

    .address-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 15px;
    }

    .address-badge.billing {
      background: #e6f0fa;
      color: #1e3a5a;
    }

    .address-badge.shipping {
      background: #e0f2e9;
      color: #2e8b57;
    }

    .address-content {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .address-line {
      margin: 0;
      color: #475569;
      font-size: 14px;
      line-height: 1.5;
    }

    .address-contact {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 5px;
      color: #224385;
      font-size: 13px;
    }

    .address-contact i {
      width: 16px;
    }

    /* Statistics Section */
    .stats-section {
      background: white;
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 20px;
      margin-top: 20px;
    }

    .stat-box {
      background: linear-gradient(135deg, #f8fafc, #ffffff);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 15px;
      border: 1px solid #f0f0f0;
      transition: all 0.2s;
    }

    .stat-box:hover {
      border-color: #224385;
      transform: translateY(-2px);
    }

    .stat-icon {
      width: 45px;
      height: 45px;
      background: linear-gradient(135deg, #224385, #764ba2);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
    }

    .stat-details {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-number {
      font-size: 20px;
      font-weight: 600;
      color: #333;
    }

    pre {
      background: #fff;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
      font-size: 11px;
      margin: 5px 0;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 15px;
      }

      .profile-grid {
        grid-template-columns: 1fr;
      }

      .addresses-grid {
        grid-template-columns: 1fr;
      }

      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .info-row {
        flex-direction: column;
        gap: 5px;
      }

      .info-label {
        width: 100%;
      }
    }
  `]
})
export class CustomerProfileComponent implements OnInit {
  customerData: any = null;  // This will hold customer_data from the response
  customerAddresses: any[] = [];  // This will hold customer_addresses from the response
  contactInfo: any = { email: '', phone: '' };
  billingAddress: any = null;
  shippingAddress: any = null;
  // stats: any = { totalOrders: 12, totalInvoices: 8, totalReturns: 2, totalCreditNotes: 3 };
  
  loading: boolean = true;
  isEditing: boolean = false;
  editedCustomer: any = {};
  debugInfo: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    console.log('CustomerProfileComponent initialized');
    this.loadCustomerProfile();
  }

  loadCustomerProfile() {
  console.log('Loading customer profile...');
  this.loading = true;
  
  // Get customer ID from localStorage or service
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const customerId = user?.id;
  
  console.log('Customer ID from localStorage:', customerId);
  
  if (!customerId) {
    console.error('No customer ID found in localStorage');
    this.loading = false;
    this.debugInfo = { error: 'No customer ID found in localStorage' };
    return;
  }
  
  // Call the correct endpoint that returns the nested structure
  this.http.get(`customers/customers/${customerId}/`).subscribe({
    next: (res: any) => {
      console.log('Full API Response:', res);
      
      // Check if the response has the expected structure with count, message, and data
      if (res && res.message === 'Success' && res.data) {
        console.log('Success response with nested data structure');
        
        // Extract the nested data
        this.customerData = res.data.customer_data;
        this.customerAddresses = res.data.customer_addresses || [];
        
        console.log('Extracted customer data:', this.customerData);
        console.log('Extracted addresses:', this.customerAddresses);
        
        this.editedCustomer = { ...this.customerData };
        
        // Extract contact info and addresses
        this.extractContactInfo();
        this.extractAddresses();
        // this.loadStats();
        
        // Set debug info for troubleshooting
        this.debugInfo = {
          fullResponse: res,
          customerData: this.customerData,
          customerAddresses: this.customerAddresses,
          billingAddress: this.billingAddress,
          shippingAddress: this.shippingAddress,
          contactInfo: this.contactInfo
        };
        
        this.loading = false;
      } 
      // Handle alternative response structure (if any)
      else if (res && res.success === 1 && res.data) {
        console.log('Alternative success response structure');
        this.customerData = res.data.customer_data;
        this.customerAddresses = res.data.customer_addresses || [];
        
        this.editedCustomer = { ...this.customerData };
        this.extractContactInfo();
        this.extractAddresses();
        // this.loadStats();
        
        this.debugInfo = {
          fullResponse: res,
          customerData: this.customerData,
          customerAddresses: this.customerAddresses,
          billingAddress: this.billingAddress,
          shippingAddress: this.shippingAddress,
          contactInfo: this.contactInfo
        };
        
        this.loading = false;
      }
      else {
        console.error('Unexpected API response structure:', res);
        this.loading = false;
        this.debugInfo = { 
          error: 'Unexpected API response structure', 
          response: res,
          expected: 'Response should have message="Success" and data with customer_data and customer_addresses'
        };
      }
    },
    error: (err) => {
      this.loading = false;
      console.error('Error loading profile:', err);
      this.debugInfo = { 
        error: err.message, 
        status: err.status,
        statusText: err.statusText
      };
    }
  });
}

  extractContactInfo() {
    console.log('Extracting contact info from addresses...');
    console.log('Customer addresses:', this.customerAddresses);
    
    if (this.customerAddresses && this.customerAddresses.length > 0) {
      // Try to find Communication address first
      const commAddress = this.customerAddresses.find((a: any) => a.address_type === 'Communication');
      if (commAddress) {
        console.log('Found Communication address:', commAddress);
        if (commAddress.email) this.contactInfo.email = commAddress.email;
        if (commAddress.phone) this.contactInfo.phone = commAddress.phone;
      } else {
        // Fallback to any address with email/phone
        const anyAddress = this.customerAddresses.find((a: any) => a.email || a.phone);
        if (anyAddress) {
          console.log('Found fallback address:', anyAddress);
          if (anyAddress.email) this.contactInfo.email = anyAddress.email;
          if (anyAddress.phone) this.contactInfo.phone = anyAddress.phone;
        } else {
          console.log('No contact info found in addresses');
        }
      }
    } else {
      console.log('No addresses found to extract contact info');
    }
    
    console.log('Extracted contact info:', this.contactInfo);
  }

  extractAddresses() {
    console.log('Extracting addresses...');
    console.log('Customer addresses array:', this.customerAddresses);
    
    if (this.customerAddresses && this.customerAddresses.length > 0) {
      // Log each address to see their structure
      this.customerAddresses.forEach((addr: any, index: number) => {
        console.log(`Address ${index}:`, addr);
        console.log(`Address type: ${addr.address_type}`);
        console.log(`Address fields:`, Object.keys(addr));
      });
      
      this.billingAddress = this.customerAddresses.find((a: any) => a.address_type === 'Billing');
      this.shippingAddress = this.customerAddresses.find((a: any) => a.address_type === 'Shipping');
      
      console.log('Found billing address:', this.billingAddress);
      console.log('Found shipping address:', this.shippingAddress);
      
      // If no specific billing/shipping, check if there are other types
      if (!this.billingAddress && !this.shippingAddress) {
        console.log('No billing/shipping addresses found, checking other types...');
        const otherAddresses = this.customerAddresses.filter((a: any) => 
          a.address_type !== 'Billing' && a.address_type !== 'Shipping'
        );
        console.log('Other addresses:', otherAddresses);
        
        // Use the first address as default for both if available
        if (otherAddresses.length > 0) {
          this.billingAddress = otherAddresses[0];
          this.shippingAddress = otherAddresses[0];
          console.log('Using first address as default:', otherAddresses[0]);
        }
      }
    } else {
      console.log('No customer addresses found');
    }
  }

  formatAddress(address: any): string {
  if (!address) {
    console.log('formatAddress called with null/undefined address');
    return 'Address not available';
  }
  
  console.log('Formatting address:', address);
  
  // Handle different possible address structures
  let addressParts = [];
  
  // Add the main address line
  if (address.address) {
    addressParts.push(address.address);
  }
  
  // Handle city - could be a string or an object
  let city = '';
  if (typeof address.city === 'string') {
    city = address.city;
  } else if (address.city && address.city.city_name) {
    city = address.city.city_name;
  } else if (address.city_name) {
    city = address.city_name;
  }
  if (city) addressParts.push(city);
  
  // Handle state - could be a string or an object
  let state = '';
  if (typeof address.state === 'string') {
    state = address.state;
  } else if (address.state && address.state.state_name) {
    state = address.state.state_name;
  } else if (address.state_name) {
    state = address.state_name;
  }
  if (state) addressParts.push(state);
  
  // Handle PIN code
  let pinCode = address.pin_code || address.pincode || address.zip_code || address.postal_code;
  if (pinCode) addressParts.push(pinCode);
  
  // Handle country - could be a string or an object
  let country = '';
  if (typeof address.country === 'string') {
    country = address.country;
  } else if (address.country && address.country.country_name) {
    country = address.country.country_name;
  } else if (address.country_name) {
    country = address.country_name;
  }
  if (country) addressParts.push(country);
  
  const formattedAddress = addressParts.filter(part => part && part.toString().trim()).join(', ');
  console.log('Formatted address:', formattedAddress);
  
  return formattedAddress || 'Address incomplete';
}
  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  }

  editProfile() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    this.editedCustomer = { ...this.customerData };
  }

  saveProfile() {
    console.log('Saving profile:', this.editedCustomer);
    // Implement save logic here
    this.isEditing = false;
  }

  // loadStats() {
  //   console.log('Loading stats...');
  //   // Load stats from various APIs
  //   // this.http.get('customers/portal/sales-orders/').subscribe(...)
  //   // For now using mock data
  // }
}