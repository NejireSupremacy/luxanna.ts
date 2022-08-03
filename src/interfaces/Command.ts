import {
  CommandInteraction,
  CreateApplicationCommand
} from '@biscuitland/core';
import { LuxClient } from '../classes/Client';

interface Exec {
  (client: LuxClient, interaction: CommandInteraction, ...args: any[]): void;
}

enum CommandCategory {
  LoL = 'LoL',
  Core = 'Core'
}

export interface Command {
  data: CreateApplicationCommand;
  cooldown: number;
  category: keyof typeof CommandCategory;
  exec: Exec;
}
