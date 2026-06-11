import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HELP_SECTIONS } from './help-content';
import { HelpSection, HelpTopic } from './help-content.model';
import { HelpService } from './help.service';

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit, OnDestroy {
  sections: HelpSection[] = HELP_SECTIONS;
  activeSection!: HelpSection;
  activeTopic!: HelpTopic;
  searchText = '';

  /** Which section group is expanded in the left nav (single-open accordion). */
  openSectionId: string | null = null;

  /** Ticked checklist items, persisted in the browser so progress survives navigation. */
  private static readonly STORAGE_KEY = 'cnl_help_checklist';
  checkedItems: Record<string, boolean> = {};

  private topicSub?: Subscription;

  constructor(private helpService: HelpService) {}

  ngOnInit(): void {
    this.activeSection = this.sections[0];
    this.activeTopic = this.activeSection.topics[0];
    this.openSectionId = this.activeSection.id;
    this.loadChecklist();

    // Contextual help: a screen may request a specific topic just before
    // navigating here (consumePending), or while this page is already open
    // (the subscription). Both land on the requested topic.
    const pending = this.helpService.consumePending();
    if (pending) { this.goToTopicById(pending); }
    this.topicSub = this.helpService.topicRequested.subscribe(id => this.goToTopicById(id));
  }

  ngOnDestroy(): void {
    this.topicSub?.unsubscribe();
  }

  /** Open a topic by its id (used by contextual help); falls back gracefully. */
  goToTopicById(topicId: string): void {
    if (!topicId) { return; }
    for (const section of this.sections) {
      const topic = section.topics.find(t => t.id === topicId);
      if (topic) {
        this.searchText = '';
        this.selectTopic(section, topic);
        return;
      }
    }
    // No exact topic — if the id is a section id, open that section's first topic.
    const section = this.sections.find(s => s.id === topicId);
    if (section && section.topics.length) {
      this.searchText = '';
      this.selectTopic(section, section.topics[0]);
    }
  }

  /** Build a stable key for a checklist item (topic + its position). */
  checkKey(index: number): string {
    return `${this.activeTopic.id}#${index}`;
  }

  isChecked(key: string): boolean {
    return !!this.checkedItems[key];
  }

  toggleCheck(key: string): void {
    this.checkedItems[key] = !this.checkedItems[key];
    try {
      localStorage.setItem(HelpComponent.STORAGE_KEY, JSON.stringify(this.checkedItems));
    } catch { /* storage unavailable — ticks just won't persist */ }
  }

  private loadChecklist(): void {
    try {
      const raw = localStorage.getItem(HelpComponent.STORAGE_KEY);
      this.checkedItems = raw ? JSON.parse(raw) : {};
    } catch { this.checkedItems = {}; }
  }

  /** Expand/collapse a section group. Clicking the open one closes it. */
  toggleSection(section: HelpSection): void {
    this.openSectionId = this.openSectionId === section.id ? null : section.id;
  }

  /** A section is shown expanded while searching, or when it is the open one. */
  isOpen(section: HelpSection): boolean {
    return !!this.searchText.trim() || this.openSectionId === section.id;
  }

  selectTopic(section: HelpSection, topic: HelpTopic): void {
    this.activeSection = section;
    this.activeTopic = topic;
    this.openSectionId = section.id; // keep its group open
    const panel = document.querySelector('.help-content');
    if (panel) { panel.scrollTop = 0; }
  }

  /** Sections (with their topics) filtered by the search box. */
  get filteredSections(): HelpSection[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) { return this.sections; }
    return this.sections
      .map(s => ({
        ...s,
        topics: s.topics.filter(t =>
          t.title.toLowerCase().includes(q) ||
          s.title.toLowerCase().includes(q))
      }))
      .filter(s => s.topics.length > 0);
  }

  /** Render **bold** markers inside paragraph text. */
  format(text: string): string {
    return (text || '').replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  }

  isActiveTopic(topic: HelpTopic): boolean {
    return this.activeTopic?.id === topic.id;
  }
}
