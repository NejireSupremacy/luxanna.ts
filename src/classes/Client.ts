import { Biscuit, Snowflake, User } from '@biscuitland/core';
import { GatewayIntents } from '@biscuitland/api-types';
import { Collection } from './Collection';
import { Client } from 'shieldbow';
import { Logger } from 'tslog';
import config from '../config';

interface CommandCooldown {
  executedAt: number;
  cooldown: number;
}
type CooldownUser = {
  [k: string]: CommandCooldown;
};

export class LuxClient extends Biscuit {
  user: User;
  color: number = 0x1e90ff;
  logger: Logger = new Logger(config.logger);
  shieldbow: Client = new Client(process.env.API_KEY);
  cooldowns: Collection<Snowflake, CooldownUser> = new Collection();

  constructor() {
    super({
      token: process.env.AUTH,
      intents:
        GatewayIntents.GuildMembers |
        GatewayIntents.DirectMessages |
        GatewayIntents.Guilds
    });

    this.shieldbow.initialize({
      version: '12.14.1',
      locale: 'en_US',
      fetch: {
        summonerSpells: false,
        champions: false,
        items: false,
        runes: false
      }
    });
  }
}
