import { Injectable } from '@angular/core';
import {
  ColumnConfig,
  ColumnConfigOptions,
  ColumnPreferences,
  IColumnStorageProvider
} from './column-config.interfaces';

/**
 * Default storage provider using localStorage.
 * Implements IColumnStorageProvider for easy swap to API-based persistence.
 */
class LocalStorageColumnProvider implements IColumnStorageProvider {
  private readonly PREFIX = 'col_cfg_';

  /**
   * Build the full storage key, scoped per user to support multi-tenant.
   * Falls back to a global key if no user context is available.
   */
  private buildKey(moduleKey: string): string {
    try {
      // Attempt to derive a user-specific prefix from the auth token
      const tokenRaw = localStorage.getItem('cnl_token') || localStorage.getItem('token');
      if (tokenRaw) {
        // JWT: extract payload.user_id or payload.sub for scoping
        const parts = tokenRaw.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          const userId = payload.user_id || payload.sub || payload.id;
          if (userId) {
            return `${this.PREFIX}${userId}_${moduleKey}`;
          }
        }
      }
    } catch {
      // Token parse failed — fall through to global key
    }
    return this.PREFIX + moduleKey;
  }

  getPreferences(moduleKey: string): ColumnPreferences | null {
    try {
      const raw = localStorage.getItem(this.buildKey(moduleKey));
      return raw ? JSON.parse(raw) as ColumnPreferences : null;
    } catch {
      return null;
    }
  }

  savePreferences(prefs: ColumnPreferences): void {
    try {
      localStorage.setItem(this.buildKey(prefs.moduleKey), JSON.stringify(prefs));
    } catch (e) {
      console.warn('[ColumnConfigService] Failed to save preferences:', e);
    }
  }

  clearPreferences(moduleKey: string): void {
    try {
      localStorage.removeItem(this.buildKey(moduleKey));
    } catch {
      // Silently ignore
    }
  }
}

/**
 * Column Configuration Service
 *
 * Manages column visibility preferences for Formly repeat-field grids.
 * Uses an abstracted storage provider (localStorage by default, swappable to API).
 *
 * Usage:
 *   - Call buildColumnList() once during component init to create the full column list
 *   - Call getHiddenKeys() to get the Set of currently hidden column keys
 *   - Call toggleColumn() when user changes a column's visibility
 *   - Call resetToDefaults() to clear user customizations
 *
 * @example
 * ```typescript
 * // In FieldRepeatComponent ngOnInit:
 * const columns = this.colSvc.buildColumnList(fieldArrayGroup, configOptions);
 * const hidden = this.colSvc.getHiddenKeys(configOptions.moduleKey, columns);
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ColumnConfigService {

  /** Current schema version — increment when column structure changes across releases */
  private readonly SCHEMA_VERSION = 2;

  /** Pluggable storage provider (default: localStorage) */
  private storage: IColumnStorageProvider = new LocalStorageColumnProvider();

  /**
   * Replace the default localStorage provider with a custom one (e.g., API-based).
   * Call this early in app bootstrap (APP_INITIALIZER or root module constructor).
   */
  setStorageProvider(provider: IColumnStorageProvider): void {
    this.storage = provider;
  }

  /**
   * Build the full column configuration list from the fieldArray's fieldGroup definitions.
   * Merges saved user preferences with defaults.
   *
   * @param fieldGroupDefs  The formly fieldArray.fieldGroup array (column templates)
   * @param options         The columnConfig from templateOptions
   * @returns               Ordered array of ColumnConfig objects
   */
  buildColumnList(
    fieldGroupDefs: any[],
    options: ColumnConfigOptions
  ): ColumnConfig[] {
    if (!fieldGroupDefs || !options) return [];

    const saved = this.storage.getPreferences(options.moduleKey);
    // Accept v1 (visibility only) and v2+ (visibility + widths) saved data
    const savedCols = (saved && saved.version >= 1) ? saved.columns : null;
    const savedWidths = (saved && saved.version >= 2 && saved.widths) ? saved.widths : null;

    const excludeSet = new Set(options.excludeFromSettings || []);

    return fieldGroupDefs.map((field: any, index: number) => {
      const key = field.key as string;
      const label = field.templateOptions?.label || field.props?.label || key || `Column ${index}`;
      const isLocked = options.lockedColumns.includes(key);
      const isExcluded = excludeSet.has(key);

      // Determine visibility: saved preference > default config > all visible
      let visible = true;
      if (savedCols && savedCols[key] !== undefined) {
        visible = savedCols[key];
      } else if (options.defaultHidden && options.defaultHidden.includes(key)) {
        visible = false;
      }

      // Locked and excluded columns are always visible regardless of saved state
      if (isLocked || isExcluded) {
        visible = true;
      }

      // Determine width: saved preference > defaultWidths config > undefined (use component default)
      let width: number | undefined;
      if (savedWidths && savedWidths[key] !== undefined) {
        width = savedWidths[key];
      } else if (options.defaultWidths && options.defaultWidths[key] !== undefined) {
        width = options.defaultWidths[key];
      }

      return {
        key,
        label,
        visible,
        locked: isLocked,
        excluded: isExcluded,
        order: index,
        width
      } as ColumnConfig;
    });
  }

  /**
   * Get the Set of currently hidden column keys for fast lookup in templates.
   *
   * @param columns  The current ColumnConfig array
   * @returns        Set of field keys that should be hidden
   */
  getHiddenKeys(columns: ColumnConfig[]): Set<string> {
    const hidden = new Set<string>();
    for (const col of columns) {
      if (!col.visible) {
        hidden.add(col.key);
      }
    }
    return hidden;
  }

  /**
   * Toggle a column's visibility and persist the change.
   *
   * @param moduleKey  The module's storage key
   * @param columns    The full ColumnConfig array (mutated in place)
   * @param key        The field key to toggle
   * @returns          Updated Set of hidden keys
   */
  toggleColumn(moduleKey: string, columns: ColumnConfig[], key: string): Set<string> {
    const col = columns.find(c => c.key === key);
    if (col && !col.locked) {
      col.visible = !col.visible;
      this.persistPreferences(moduleKey, columns);
    }
    return this.getHiddenKeys(columns);
  }

  /**
   * Reset all columns to their default visibility (clears saved preferences).
   *
   * @param fieldGroupDefs  The formly fieldArray.fieldGroup array
   * @param options         The columnConfig from templateOptions
   * @returns               Fresh ColumnConfig array with defaults applied
   */
  resetToDefaults(
    fieldGroupDefs: any[],
    options: ColumnConfigOptions
  ): ColumnConfig[] {
    this.storage.clearPreferences(options.moduleKey);
    const excludeSet = new Set(options.excludeFromSettings || []);
    // Rebuild from scratch without saved preferences
    return fieldGroupDefs.map((field: any, index: number) => {
      const key = field.key as string;
      const label = field.templateOptions?.label || field.props?.label || key || `Column ${index}`;
      const isLocked = options.lockedColumns.includes(key);
      const isExcluded = excludeSet.has(key);
      const isDefaultHidden = options.defaultHidden?.includes(key) ?? false;

      return {
        key,
        label,
        visible: (isLocked || isExcluded) ? true : !isDefaultHidden,
        locked: isLocked,
        excluded: isExcluded,
        order: index
      } as ColumnConfig;
    });
  }

  /**
   * Update a specific column's width and persist the change.
   *
   * @param moduleKey  The module's storage key
   * @param columns    The full ColumnConfig array (mutated in place)
   * @param key        The field key whose width changed
   * @param width      The new width in pixels
   */
  updateColumnWidth(moduleKey: string, columns: ColumnConfig[], key: string, width: number): void {
    const col = columns.find(c => c.key === key);
    if (col) {
      col.width = width;
      this.persistPreferences(moduleKey, columns);
    }
  }

  /**
   * Get a map of column key → width for fast lookup in templates.
   *
   * @param columns  The current ColumnConfig array
   * @returns        Map of field key → width in pixels
   */
  getColumnWidthMap(columns: ColumnConfig[]): Map<string, number> {
    const map = new Map<string, number>();
    for (const col of columns) {
      if (col.width !== undefined) {
        map.set(col.key, col.width);
      }
    }
    return map;
  }

  /**
   * Persist the current column state (visibility + widths) to storage.
   */
  private persistPreferences(moduleKey: string, columns: ColumnConfig[]): void {
    const colMap: { [key: string]: boolean } = {};
    const widthMap: { [key: string]: number } = {};
    let hasWidths = false;

    for (const col of columns) {
      colMap[col.key] = col.visible;
      if (col.width !== undefined) {
        widthMap[col.key] = col.width;
        hasWidths = true;
      }
    }

    const prefs: ColumnPreferences = {
      moduleKey,
      version: this.SCHEMA_VERSION,
      columns: colMap,
      updatedAt: new Date().toISOString()
    };

    if (hasWidths) {
      prefs.widths = widthMap;
    }

    this.storage.savePreferences(prefs);
  }
}
