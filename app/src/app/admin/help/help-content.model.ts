/**
 * Data model for the in-app HelpBook (User Guide).
 *
 * The whole guide is plain data (see help-content.ts) so the content can be
 * extended module-by-module without touching the rendering component.
 *
 * One SECTION (e.g. "User Management") contains many TOPICS (e.g. "Logging In").
 * One TOPIC is a list of BLOCKS rendered top-to-bottom.
 */

export type HelpBlockType =
  | 'lead'        // highlighted intro sentence(s)
  | 'subheading'  // a heading inside a topic
  | 'para'        // a normal paragraph (supports **bold**)
  | 'path'        // "How to reach it" navigation breadcrumb
  | 'fields'      // a Field / Required / What to enter / Why table
  | 'table'       // a generic table (columns + rows)
  | 'steps'       // numbered step list
  | 'tip'         // green "good to know" callout
  | 'warn'        // amber "important" callout
  | 'checklist';  // simple checklist

export interface HelpField {
  name: string;          // field label as shown on screen
  required?: string;     // 'Yes' | 'No' | 'Edit only' | ''
  enter: string;         // what the user types/selects
  why: string;           // why it matters / what it does
}

export interface HelpBlock {
  type: HelpBlockType;
  text?: string;         // lead / para / subheading / path / callout text
  items?: string[];      // steps / checklist entries
  fields?: HelpField[];  // for type === 'fields'
  columns?: string[];    // for type === 'table'
  rows?: string[][];     // for type === 'table'
}

export interface HelpTopic {
  id: string;            // url-safe slug, unique within the guide
  title: string;
  blocks: HelpBlock[];
}

export interface HelpSection {
  id: string;
  title: string;
  icon: string;          // font-awesome class, e.g. 'fas fa-users'
  summary?: string;      // one line shown under the section title
  topics: HelpTopic[];
}
