import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';

@Injectable({
  providedIn: 'root',
})
export class MixpanelService {
  constructor() {
    mixpanel.init('12d7846716c8d6fadce51a84808b0f6c', {
      debug: true,
      track_pageview: true,
      persistence: 'localStorage',
    });
  }

  track(eventName: string, properties?: any) {
    mixpanel.track(eventName, properties);
  }
}
