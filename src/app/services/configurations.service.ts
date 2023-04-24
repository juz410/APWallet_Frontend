import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Network } from '@capacitor/network';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {
  private connected = true;

  constructor() { 
    this.networkStatus();
    Network.addListener('networkStatusChange', status => {
      this.connected = status.connected;
    });
  }


  private async networkStatus() {
    const status = await Network.getStatus();
    this.connected = status.connected;
  }

  get connectionStatus(): boolean {
    return this.connected;
  }

}
