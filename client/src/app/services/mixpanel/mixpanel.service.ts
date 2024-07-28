import { Injectable } from '@angular/core';
import mixpanel, { Dict } from 'mixpanel-browser';
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

  track(eventName: string, properties?: Dict) {
    mixpanel.track(eventName, properties);
  }
}
