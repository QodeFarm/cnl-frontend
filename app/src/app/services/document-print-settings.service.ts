import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SiteConfigService } from '@ta/ta-core';

export interface PrintTemplateColumn {
  key: string;
  label: string;
  visible: boolean;
  order: number;
  width?: number;
}

export interface PrintTemplateSectionConfig {
  show_logo?: boolean;
  show_company_address?: boolean;
  show_company_phone?: boolean;
  show_company_email?: boolean;
  show_gstin?: boolean;
  show_billing_address?: boolean;
  show_shipping_address?: boolean;
  show_tax_breakdown?: boolean;
  show_subtotal?: boolean;
  show_discount?: boolean;
  show_shipping_charges?: boolean;
  show_cess?: boolean;
  show_round_off?: boolean;
  show_party_balance?: boolean;
  show_amount_in_words?: boolean;
  show_bank_details?: boolean;
  show_terms?: boolean;
  show_notes?: boolean;
  show_signature?: boolean;
  show_declaration?: boolean;
  [key: string]: boolean | undefined;
}

export interface PrintTemplateStyleConfig {
  paper_size?: string;
  color_theme?: string;
  font_size?: string;
  header_color?: string;
  [key: string]: string | undefined;
}

export interface PrintTemplateCopyConfig {
  num_copies?: number;
  copy_labels?: string[];
  [key: string]: number | string[] | undefined;
}

export interface PrintTemplateCustomText {
  terms_conditions?: string;
  notes?: string;
  footer_note?: string;
  declaration?: string;
  [key: string]: string | undefined;
}

export interface DocumentPrintTemplate {
  template_id?: string;
  company?: string;
  document_type: string;
  template_name: string;
  is_default: boolean;
  paper_size: string;
  column_config: PrintTemplateColumn[];
  section_config: PrintTemplateSectionConfig;
  style_config: PrintTemplateStyleConfig;
  copy_config: PrintTemplateCopyConfig;
  custom_text: PrintTemplateCustomText;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface PrintDefaultsResponse {
  document_type: string;
  columns: Array<{
    key: string;
    label: string;
    default_visible: boolean;
    required: boolean;
    order: number;
  }>;
  sections: Array<{
    key: string;
    label: string;
    default_value: boolean;
    group: string;
  }>;
  paper_sizes: Array<{ value: string; label: string }>;
  color_themes: Array<{ value: string; label: string }>;
  font_sizes: Array<{ value: string; label: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentPrintSettingsService {

  constructor(
    private http: HttpClient,
    private siteConfigService: SiteConfigService
  ) {}

  private get baseUrl(): string {
    return this.siteConfigService.CONFIG?.baseUrl || '';
  }

  getDefaults(documentType: string): Observable<PrintDefaultsResponse> {
    return this.http.get<any>(
      `${this.baseUrl}masters/document-print-defaults/?document_type=${documentType}`
    ).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  getTemplates(companyId: string, documentType: string): Observable<DocumentPrintTemplate[]> {
    const params = new HttpParams()
      .set('company', companyId)
      .set('document_type', documentType);
    return this.http.get<any>(
      `${this.baseUrl}masters/document-print-templates/`, { params }
    ).pipe(
      map((res: any) => res?.data ?? res?.results ?? res ?? [])
    );
  }

  createTemplate(template: Partial<DocumentPrintTemplate>): Observable<DocumentPrintTemplate> {
    return this.http.post<any>(
      `${this.baseUrl}masters/document-print-templates/`, template
    ).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  updateTemplate(templateId: string, template: Partial<DocumentPrintTemplate>): Observable<DocumentPrintTemplate> {
    return this.http.put<any>(
      `${this.baseUrl}masters/document-print-templates/${templateId}/`, template
    ).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  deleteTemplate(templateId: string): Observable<any> {
    return this.http.delete(
      `${this.baseUrl}masters/document-print-templates/${templateId}/`
    );
  }

  getCompany(): Observable<any[]> {
    return this.http.get<any>(`${this.baseUrl}company/companies/`).pipe(
      map((res: any) => res?.data ?? res?.results ?? (Array.isArray(res) ? res : []))
    );
  }
}
