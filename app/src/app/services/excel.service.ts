import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  constructor(
    private http: HttpClient,
    private notification: NzNotificationService
  ) {}

  /**
   * Downloads an Excel template from the specified endpoint
   * @param endpoint API endpoint for the template
   * @param filename Name to save the file as
   * @returns Observable for handling the download operation
   */
  downloadTemplate(endpoint: string, filename: string): Observable<any> {
    // We'll only show the success message, not the initial info message
    
    return new Observable(observer => {
      this.http.get(endpoint, { responseType: 'blob' })
        .subscribe({
          next: (res: Blob) => {
            const a = document.createElement('a');
            const url = window.URL.createObjectURL(res);
            a.href = url;
            a.download = filename;
            a.click();
            window.URL.revokeObjectURL(url);
            this.notification.success('Success', 'Template downloaded successfully');
            observer.next(res);
            observer.complete();
          },
          error: (error) => {
            console.error('Download error', error);
            this.notification.error('Error', 'Failed to download template');
            observer.error(error);
          }
        });
    });
  }

  /**
   * Uploads an Excel file to the specified endpoint
   * @param endpoint API endpoint for the upload
   * @param file File to upload
   * @param successCallback Function to call on success
   * @param errorCallback Function to call on error
   * @param entityName Name of the entity (e.g., 'customers', 'products')
   */
  uploadExcel(endpoint: string, file: File, successCallback: Function, errorCallback: Function, entityName: string): void {
    if (!file || !(file instanceof File)) {
      this.notification.error('Error', 'No valid file selected!');
      return;
    }

    const uploadData = new FormData();
    uploadData.append('file', file);

    // Add headers to skip the default error interceptor
    const headers = { 'X-Skip-Error-Interceptor': 'true' };

    this.http.post(endpoint, uploadData, { headers }).subscribe({
      next: (res: any) => {
        console.log(`Upload success for ${entityName}`, res);
        
        // Check for empty Excel file (only headers, no data)
        if (res.success === 0 || (res.message && res.message.includes('0 imported'))) {
          this.notification.warning(
            'No Data Imported',
            `The Excel file appears to be empty. Please add data to the template before importing.`,
            { nzDuration: 6000 }
          );
          return;
        }

        // Check for errors in response
        if (res.errors && res.errors.length > 0) {
          const successCount = res.message ? res.message.split(' ')[0] : '0';
          const errorCount = res.errors.length;
          
          // Check if errors are related to missing required fields
          const missingFieldErrors = res.errors.filter((e: any) => 
            e.error && (e.error.includes('Missing required field:') || e.error.includes('missing required'))
          );
          
          if (missingFieldErrors.length > 0) {
            // Extract the missing field names from the error messages
            const missingFields = missingFieldErrors.map((e: any) => {
              const match = e.error.match(/Missing required fields?:?\s*(.+)/i);
              return match ? match[1] : '';
            }).filter(Boolean);
            
            // Create a clear message about required fields
            const message = `Required fields missing: ${missingFields.join(', ')}`;
            this.notification.error('Import Failed', message, { nzDuration: 6000 });
          } else {
            // Generic partial import message for other types of errors
            this.notification.warning(
              'Partial Import',
              `${successCount} ${entityName} imported, ${errorCount} failed.`,
              { nzDuration: 5000 }
            );
          }
        } else {
          // Success - use the exact message from the backend
          this.notification.success('Success', res.message || `${entityName} imported successfully`, { nzDuration: 3000 });
        }

        // Call success callback if provided
        if (successCallback) {
          successCallback(res);
        }
      },
      error: (error) => {
        console.error(`Upload error for ${entityName}`, error);
        
        // Extract the error details
        let errorResponse = error.error || {};
        
        // Check if error response is in array format [response, false]
        if (Array.isArray(errorResponse) && errorResponse.length >= 2) {
          errorResponse = errorResponse[0] || {};
        }
        
        // Check for missing columns error
        if (errorResponse.error && (
            errorResponse.missing_columns || 
            errorResponse.unexpected_columns || 
            errorResponse.missing_required_columns)) {
          
          // Get the list of missing columns if available
          const missingColumns = errorResponse.missing_columns || [];
          const message = missingColumns.length > 0 
            ? `Excel template format mismatch. Missing columns: ${missingColumns.join(', ')}`
            : 'Excel template format mismatch.';
          
          this.notification.error('Excel Template Error', message, { nzDuration: 5000 });
        } else {
          const msg = errorResponse?.error || errorResponse?.message || error?.message || `Failed to import ${entityName}. Please check your file format.`;
          this.notification.error('Import Failed', msg, { nzDuration: 5000 });
        }

        // Call error callback if provided
        if (errorCallback) {
          errorCallback(error);
        }
      }
    });
  }
}
