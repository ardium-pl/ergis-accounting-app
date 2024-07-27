import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MixpanelService {
  constructor() {
    const ErgisToken: string = environment.ergisMixpanelToken;
    mixpanel.init(ErgisToken, {
      debug: false,
      track_pageview: true,
      persistence: 'localStorage',
    });
  }

  track(eventName: string, properties?: any) {
    mixpanel.track(eventName, properties);
  }
}
