import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LoadingService {
    private requestCount = 0; // Track the number of ongoing requests
    private _loading = new BehaviorSubject<boolean>(false);
    public readonly loading$ = this._loading.asObservable();

    show() {
        this.requestCount++;
        if (!this._loading.value) {
            this._loading.next(true);
        }
    }

    hide() {
        if (this.requestCount > 0)
            this.requestCount--;

        if (this.requestCount === 0) {
            this._loading.next(false);
        }
    }
}
