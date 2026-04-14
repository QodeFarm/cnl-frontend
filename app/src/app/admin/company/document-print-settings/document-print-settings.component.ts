import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { AdminCommmonModule } from 'src/app/admin-commmon/admin-commmon.module';
import {
  DocumentPrintSettingsService,
  DocumentPrintTemplate,
  PrintTemplateColumn,
  PrintDefaultsResponse
} from 'src/app/services/document-print-settings.service';

export interface DocTypeTab {
  key: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-document-print-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    AdminCommmonModule,
    NzTabsModule,
    NzCardModule,
    NzButtonModule,
    NzSwitchModule,
    NzSelectModule,
    NzInputModule,
    NzDividerModule,
    NzModalModule,
    NzSpinModule,
    NzIconModule,
    NzToolTipModule,
    NzTagModule,
    NzCheckboxModule
  ],
  templateUrl: './document-print-settings.component.html',
  styleUrls: ['./document-print-settings.component.scss']
})
export class DocumentPrintSettingsComponent implements OnInit, OnDestroy {

  @ViewChild('templateNameInput') templateNameInputRef!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  docTypeTabs: DocTypeTab[] = [
    { key: 'sale_order', label: 'Sale Order', icon: 'file-text' },
    { key: 'sale_invoice', label: 'Sale Invoice', icon: 'file-done' },
    { key: 'sale_return', label: 'Sale Return', icon: 'rollback' },
    { key: 'delivery_challan', label: 'Delivery Challan', icon: 'car' },
    { key: 'purchase_order', label: 'Purchase Order', icon: 'shopping-cart' },
    { key: 'purchase_return', label: 'Purchase Return', icon: 'undo' },
    { key: 'payment_receipt', label: 'Payment Receipt', icon: 'wallet' },
    { key: 'bill_receipt', label: 'Bill Receipt', icon: 'credit-card' },
    { key: 'account_ledger', label: 'Account Ledger', icon: 'book' }
  ];

  activeDocType: string = 'sale_order';
  companyId: string = '';

  // Per-tab state
  tabState: Record<string, {
    loading: boolean;
    saving: boolean;
    defaults: PrintDefaultsResponse | null;
    templates: DocumentPrintTemplate[];
    activeTemplate: DocumentPrintTemplate | null;
    isDirty: boolean;
  }> = {};

  // (modal removed — new template created inline)

  // Section groups for display
  sectionGroups: Record<string, { key: string; label: string }[]> = {};

  constructor(
    private service: DocumentPrintSettingsService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.initTabStates();
    this.loadCompany();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.modal.closeAll();
  }

  private initTabStates(): void {
    for (const tab of this.docTypeTabs) {
      this.tabState[tab.key] = {
        loading: false,
        saving: false,
        defaults: null,
        templates: [],
        activeTemplate: null,
        isDirty: false
      };
    }
  }

  private loadCompany(): void {
    this.service.getCompany()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (companies: any[]) => {
          if (companies.length > 0) {
            this.companyId = companies[0].company_id;
          }
          this.loadTab(this.activeDocType);
        },
        error: () => {
          this.loadTab(this.activeDocType);
        }
      });
  }

  onTabChange(docType: string | undefined): void {
    if (!docType) return;
    this.activeDocType = docType;
    const state = this.tabState[docType];
    if (!state.defaults) {
      this.loadTab(docType);
    } else {
      // Rebuild section groups for this tab even if already loaded
      this.buildSectionGroups(docType, state.defaults);
    }
  }

  private loadTab(docType: string): void {
    const state = this.tabState[docType];
    state.loading = true;

    this.service.getDefaults(docType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (defaults) => {
          state.defaults = defaults;
          this.buildSectionGroups(docType, defaults);
          if (this.companyId) {
            this.loadTemplates(docType);
          } else {
            state.loading = false;
            this.initNewTemplate(docType);
          }
        },
        error: () => {
          state.loading = false;
          this.message.error(`Failed to load defaults for ${docType}.`);
        }
      });
  }

  private loadTemplates(docType: string): void {
    const state = this.tabState[docType];
    this.service.getTemplates(this.companyId, docType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (templates: DocumentPrintTemplate[]) => {
          state.templates = templates || [];
          state.loading = false;
          const defaultTpl = state.templates.find(t => t.is_default) || state.templates[0];
          if (defaultTpl) {
            state.activeTemplate = this.deepClone(defaultTpl);
          } else {
            this.initNewTemplate(docType);
          }
        },
        error: () => {
          state.loading = false;
          this.initNewTemplate(docType);
        }
      });
  }

  private initNewTemplate(docType: string): void {
    const state = this.tabState[docType];
    const defaults = state.defaults;
    if (!defaults) return;

    const columns: PrintTemplateColumn[] = defaults.columns.map((col, idx) => ({
      key: col.key,
      label: col.label,
      visible: col.default_visible,
      order: idx,
      width: undefined
    }));

    state.activeTemplate = {
      document_type: docType,
      template_name: `Default ${this.getDocTypeLabel(docType)} Template`,
      is_default: true,
      paper_size: 'Custom_11x16',
      column_config: columns,
      section_config: this.buildDefaultSections(defaults),
      style_config: { color_theme: 'blue', font_size: 'medium' },
      copy_config: { num_copies: 1, copy_labels: ['Original'] },
      custom_text: {}
    };
    // Do NOT auto-set isDirty here — the orange dot must only appear when the
    // user has actually made a change. The Save button handles the "no templates yet"
    // case separately via the [nzDisabled] binding in the template.
  }

  private buildDefaultSections(defaults: PrintDefaultsResponse): Record<string, boolean> {
    const result: Record<string, boolean> = {};
    for (const sec of defaults.sections) {
      result[sec.key] = sec.default_value;
    }
    return result;
  }

  private buildSectionGroups(_docType: string, defaults: PrintDefaultsResponse): void {
    const groups: Record<string, { key: string; label: string }[]> = {};
    for (const sec of defaults.sections) {
      const group = sec.group || 'General';
      if (!groups[group]) groups[group] = [];
      groups[group].push({ key: sec.key, label: sec.label });
    }
    this.sectionGroups = groups;
  }

  getSectionGroupKeys(): string[] {
    return Object.keys(this.sectionGroups);
  }

  get currentState() {
    return this.tabState[this.activeDocType];
  }

  get currentTemplate(): DocumentPrintTemplate | null {
    return this.tabState[this.activeDocType]?.activeTemplate || null;
  }

  get currentDefaults(): PrintDefaultsResponse | null {
    return this.tabState[this.activeDocType]?.defaults || null;
  }

  getDocTypeLabel(key: string): string {
    return this.docTypeTabs.find(t => t.key === key)?.label || key;
  }

  // ── Column Config ──────────────────────────────────────────

  moveColumnUp(index: number): void {
    const cols = this.currentTemplate?.column_config;
    if (!cols || index <= 0) return;
    [cols[index - 1], cols[index]] = [cols[index], cols[index - 1]];
    this.updateOrders(cols);
    this.markDirty();
  }

  moveColumnDown(index: number): void {
    const cols = this.currentTemplate?.column_config;
    if (!cols || index >= cols.length - 1) return;
    [cols[index], cols[index + 1]] = [cols[index + 1], cols[index]];
    this.updateOrders(cols);
    this.markDirty();
  }

  private updateOrders(cols: PrintTemplateColumn[]): void {
    cols.forEach((col, idx) => col.order = idx);
  }

  onColumnToggle(col: PrintTemplateColumn): void {
    col.visible = !col.visible;
    this.markDirty();
  }

  isColumnRequired(key: string): boolean {
    const defaults = this.currentDefaults;
    if (!defaults) return false;
    return defaults.columns.find(c => c.key === key)?.required || false;
  }

  // ── Section Config ──────────────────────────────────────────

  onSectionToggle(key: string): void {
    const tpl = this.currentTemplate;
    if (!tpl) return;
    if (!tpl.section_config) tpl.section_config = {};
    tpl.section_config[key] = !tpl.section_config[key];
    this.markDirty();
  }

  getSectionValue(key: string): boolean {
    return this.currentTemplate?.section_config?.[key] ?? true;
  }

  // ── Style Config ──────────────────────────────────────────

  onStyleChange(): void {
    this.markDirty();
  }

  // ── Copy Config ──────────────────────────────────────────

  onNumCopiesChange(n: number): void {
    const tpl = this.currentTemplate;
    if (!tpl) return;
    if (!tpl.copy_config) tpl.copy_config = { num_copies: 1, copy_labels: ['Original'] };
    tpl.copy_config.num_copies = n;
    const labels = tpl.copy_config.copy_labels || [];
    while (labels.length < n) labels.push(labels.length === 0 ? 'Original' : `Copy ${labels.length}`);
    tpl.copy_config.copy_labels = labels.slice(0, n);
    this.markDirty();
  }

  onCopyLabelChange(idx: number, value: string): void {
    const tpl = this.currentTemplate;
    if (!tpl?.copy_config?.copy_labels) return;
    tpl.copy_config.copy_labels[idx] = value;
    this.markDirty();
  }

  // ── Template Management ──────────────────────────────────────────

  selectTemplate(tpl: DocumentPrintTemplate): void {
    if (this.currentState?.isDirty) {
      this.openConfirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. If you switch now, your changes will be lost.',
        okText: 'Discard Changes',
        onOk: () => {
          this.currentState.activeTemplate = this.deepClone(tpl);
          this.currentState.isDirty = false;
        }
      });
    } else {
      this.currentState.activeTemplate = this.deepClone(tpl);
      this.currentState.isDirty = false;
    }
  }

  createNewTemplate(): void {
    const doCreate = () => {
      const defaults = this.currentDefaults;
      if (!defaults) return;

      const columns: PrintTemplateColumn[] = defaults.columns.map((col, idx) => ({
        key: col.key,
        label: col.label,
        visible: col.default_visible,
        order: idx
      }));

      // If no saved templates exist yet, this becomes the default automatically
      const shouldBeDefault = this.currentState.templates.length === 0;
      this.currentState.activeTemplate = {
        document_type: this.activeDocType,
        template_name: 'New Template',
        is_default: shouldBeDefault,
        paper_size: 'Custom_11x16',
        column_config: columns,
        section_config: this.buildDefaultSections(defaults),
        style_config: { color_theme: 'blue', font_size: 'medium' },
        copy_config: { num_copies: 1, copy_labels: ['Original'] },
        custom_text: {}
      };
      this.currentState.isDirty = true;

      // Focus + select the template name input so user can type immediately
      setTimeout(() => {
        const el = this.templateNameInputRef?.nativeElement;
        if (el) { el.focus(); el.select(); }
      }, 50);
    };

    if (this.currentState?.isDirty) {
      this.openConfirm({
        title: 'Unsaved Changes',
        content: 'You have unsaved changes. If you continue, your current changes will be lost.',
        okText: 'Discard & Create New',
        onOk: doCreate
      });
    } else {
      doCreate();
    }
  }

  deleteTemplate(tpl: DocumentPrintTemplate): void {
    if (!tpl.template_id) {
      this.message.warning('This template has not been saved yet.');
      return;
    }
    this.openConfirm({
      title: 'Delete Template',
      content: `Are you sure you want to delete "${tpl.template_name}"? This action cannot be undone.`,
      okText: 'Delete',
      danger: true,
      onOk: () => {
        this.service.deleteTemplate(tpl.template_id!)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              const state = this.currentState;
              state.templates = state.templates.filter(t => t.template_id !== tpl.template_id);
              const next = state.templates.find(t => t.is_default) || state.templates[0];
              if (next) {
                state.activeTemplate = this.deepClone(next);
              } else {
                this.initNewTemplate(this.activeDocType);
              }
              this.message.success('Template deleted.');
            },
            error: () => this.message.error('Failed to delete template.')
          });
      }
    });
  }

  // ── Save ──────────────────────────────────────────

  saveTemplate(): void {
    const state = this.currentState;
    if (state.saving) return;           // double-submit guard
    const tpl = state.activeTemplate;
    if (!tpl) return;

    if (!this.companyId) {
      this.message.error('Company not loaded. Please refresh the page and try again.');
      return;
    }

    if (!tpl.template_name?.trim() || tpl.template_name.trim().length < 2) {
      this.message.warning('Template name must be at least 2 characters.');
      return;
    }

    state.saving = true;
    const payload = { ...tpl, company: this.companyId };

    const req$ = tpl.template_id
      ? this.service.updateTemplate(tpl.template_id, payload)
      : this.service.createTemplate(payload);

    req$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (saved: DocumentPrintTemplate) => {
        state.saving = false;
        state.isDirty = false;

        // If the saved template is now the default, remove the default badge
        // from all other templates in the local list — the backend already did
        // this in the DB, but the frontend array doesn't know about it.
        if (saved.is_default) {
          state.templates.forEach(t => {
            if (t.template_id !== saved.template_id) {
              t.is_default = false;
            }
          });
        }

        if (tpl.template_id) {
          const idx = state.templates.findIndex(t => t.template_id === tpl.template_id);
          if (idx >= 0) state.templates[idx] = saved;
        } else {
          state.templates.push(saved);
        }
        state.activeTemplate = this.deepClone(saved);
        this.message.success('Template saved successfully.');
      },
      error: () => {
        state.saving = false;
        this.message.error('Failed to save template. Please try again.');
      }
    });
  }

  resetToDefaults(): void {
    this.openConfirm({
      title: 'Reset to Defaults',
      content: 'This will reset all layout, columns, and style settings back to their default values. Any unsaved changes will be lost.',
      okText: 'Reset',
      onOk: () => {
        this.initNewTemplate(this.activeDocType);
        this.currentState.isDirty = true;
      }
    });
  }

  // ── Shared confirm dialog (matches project dark-navy modal theme) ──────
  private openConfirm(opts: {
    title: string;
    content: string;
    okText: string;
    danger?: boolean;
    onOk: () => void;
  }): void {
    const ref = this.modal.create({
      nzTitle: opts.title,
      nzContent: opts.content,
      nzClassName: opts.danger ? 'dps-confirm-modal dps-confirm-danger' : 'dps-confirm-modal',
      nzWidth: 440,
      nzCentered: true,
      nzFooter: [
        {
          label: 'Cancel',
          type: 'default',
          onClick: () => ref.destroy()
        },
        {
          label: opts.okText,
          type: 'primary',
          danger: opts.danger || false,
          onClick: () => { opts.onOk(); ref.destroy(); }
        }
      ]
    });
  }

  markDirty(): void {
    if (this.currentState) this.currentState.isDirty = true;
  }

  trackByIndex(index: number): number {
    return index;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  // ── Helpers ──────────────────────────────────────────

  getPaperSizeLabel(key: string): string {
    return this.getPaperSizes().find(p => p.value === key)?.label || key;
  }

  getPaperSizes(): { value: string; label: string }[] {
    return this.currentDefaults?.paper_sizes || [
      { value: 'Custom_11x16', label: '11×16 inch (Default)' },
      { value: 'A4', label: 'A4 (210×297mm)' },
      { value: 'A4_Landscape', label: 'A4 Landscape' },
      { value: 'A5', label: 'A5 (148×210mm)' },
      { value: 'Letter', label: 'Letter (8.5×11 inch)' }
    ];
  }

  getColorThemes(): { value: string; label: string }[] {
    return this.currentDefaults?.color_themes || [
      { value: 'blue', label: 'Blue (Professional)' },
      { value: 'green', label: 'Green' },
      { value: 'orange', label: 'Orange' },
      { value: 'grey', label: 'Grey' },
      { value: 'purple', label: 'Purple' },
      { value: 'teal', label: 'Teal' },
      { value: 'none', label: 'No Color' }
    ];
  }

  getFontSizes(): { value: string; label: string }[] {
    return this.currentDefaults?.font_sizes || [
      { value: 'small', label: 'Small' },
      { value: 'medium', label: 'Medium (Default)' },
      { value: 'large', label: 'Large' }
    ];
  }

  getCopyCountOptions(): number[] {
    return [1, 2, 3, 4];
  }
}
