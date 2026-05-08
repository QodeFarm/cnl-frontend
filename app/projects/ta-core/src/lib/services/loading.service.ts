import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    // ── Router navigation loading (big spinner in app.component) ──────────
    private routerCount = 0;
    private _loading = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this._loading.asObservable();

    show() {
        this.routerCount++;
        if (!this._loading.value) {
            this._loading.next(true);
        }
    }

    hide() {
        if (this.routerCount > 0) this.routerCount--;
        if (this.routerCount === 0) {
            this._loading.next(false);
        }
    }

    // ── HTTP request loading (thin top progress bar in admin-layout) ───────
    private httpCount = 0;
    private _httpLoading = new BehaviorSubject<boolean>(false);
    public readonly httpLoading$ = this._httpLoading.asObservable();

    showHttp() {
        this.httpCount++;
        if (!this._httpLoading.value) {
            this._httpLoading.next(true);
        }
    }

    hideHttp() {
        if (this.httpCount > 0) this.httpCount--;
        if (this.httpCount === 0) {
            this._httpLoading.next(false);
        }
    }
}
