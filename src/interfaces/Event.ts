import { LuxClient } from '../classes/Client';
import { Events } from '@biscuitland/core';

interface Exec {
  (client: LuxClient, ...args: any[]): Promise<unknown>;
}

export interface Event {
  name: keyof Events;
  exec: Exec;
}
