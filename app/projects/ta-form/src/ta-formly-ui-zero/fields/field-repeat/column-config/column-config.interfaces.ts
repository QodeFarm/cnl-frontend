/**
 * Column Configuration Interfaces
 *
 * column personalization system for Formly repeat-field grids.
 * Supports user-level preferences with abstracted persistence (localStorage now, API later).
 *
 * @module ColumnConfig
 * @version 1.0.0
 */

/**
 * Describes one column's configuration state.
 */
export interface ColumnConfig {
  /** Field key from formly fieldArray.fieldGroup (e.g., 'product', 'quantity') */
  key: string;

  /** Human-readable label for the settings dropdown */
  label: string;

  /** Whether this column is currently visible */
  visible: boolean;

  /** Whether user can toggle this column (locked columns are always visible) */
  locked: boolean;

  /**
   * Whether this column is excluded from the settings dropdown entirely.
   * Excluded columns are always visible and do not appear in the toggle list.
   * Use for UI-only controls (row checkboxes, etc.).
   */
  excluded?: boolean;

  /** Display order index (reserved for future drag-reorder feature) */
  order: number;

  /** Column width in pixels (undefined = use default width) */
  width?: number;
}

/**
 * Persisted user preferences for a specific module's grid.
 */
export interface ColumnPreferences {
  /** Unique identifier for the module (e.g., 'sale_order_items') */
  moduleKey: string;

  /** Schema version — allows safe migration if column set changes */
  version: number;

  /** Map of field key → visibility state */
  columns: { [key: string]: boolean };

  /** Map of field key → width in pixels (added in schema v2) */
  widths?: { [key: string]: number };

  /** ISO timestamp of last save */
  updatedAt: string;
}

/**
 * Configuration passed via templateOptions.columnConfig
 * by the consuming component (e.g., SalesComponent).
 */
export interface ColumnConfigOptions {
  /** Unique storage key for this module's grid (e.g., 'sale_order_items') */
  moduleKey: string;

  /** Field keys that are always visible and cannot be toggled */
  lockedColumns: string[];

  /** Field keys that start hidden by default (user can reveal them) */
  defaultHidden?: string[];

  /**
   * Field keys to exclude from the column settings dropdown entirely.
   * Use for UI-only controls (e.g., row-selection checkboxes) that
   * should never be toggled by the user.
   */
  excludeFromSettings?: string[];

  /** Default column widths by field key (used when no saved preference exists) */
  defaultWidths?: { [key: string]: number };

  /** Minimum allowed column width in pixels during resize drag (default: 60) */
  minColumnWidth?: number;

  /** Whether column resize is enabled for this module (default: true) */
  enableResize?: boolean;

  /** Whether the Columns settings button/dropdown is shown (default: true) */
  showColumnSettings?: boolean;
}

/**
 * Abstracted storage provider interface.
 * Implement this to swap persistence strategy (localStorage → REST API → IndexedDB).
 */
export interface IColumnStorageProvider {
  /** Retrieve saved preferences for a module grid, or null if none saved */
  getPreferences(moduleKey: string): ColumnPreferences | null;

  /** Persist preferences for a module grid */
  savePreferences(prefs: ColumnPreferences): void;

  /** Remove saved preferences for a module grid */
  clearPreferences(moduleKey: string): void;
}
