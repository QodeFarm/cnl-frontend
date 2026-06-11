import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Bridges a screen's "Help" button to the in-app User Guide.
 *
 * A screen calls openTopic('customers'); the Help page then jumps to that
 * topic. A service (not a URL param) is used because the admin runs on a tab
 * system that keeps the Help component alive — so we must be able to re-target
 * the topic even when the User Guide tab is already open.
 */
@Injectable({ providedIn: 'root' })
export class HelpService {
  private topicSubject = new Subject<string>();

  /** Emits a topic id whenever a screen requests contextual help. */
  readonly topicRequested = this.topicSubject.asObservable();

  /** Held for the very first load of the Help page (before it can subscribe). */
  private pending: string | null = null;

  /** Open the User Guide at a specific topic id (see help-content.ts ids). */
  openTopic(topicId: string): void {
    this.pending = topicId;
    this.topicSubject.next(topicId);
  }

  /** Read + clear the pending topic — called once by the Help page on init. */
  consumePending(): string | null {
    const t = this.pending;
    this.pending = null;
    return t;
  }
}
