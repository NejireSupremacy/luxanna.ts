import { Biscuit, Snowflake, User } from '@biscuitland/core';
import { GatewayIntents } from '@biscuitland/api-types';
import { Command } from '../interfaces/Command';
import { Collection } from './Collection';
import { Client } from 'shieldbow';
import { readdirSync } from 'fs';
import { Logger } from 'tslog';
import config from '../config';
import { join } from 'path';

interface CommandCooldown {
  executedAt: number;
  cooldown: number;
}
type CooldownUser = {
  [k: string]: CommandCooldown;
};

export class LuxClient extends Biscuit {
  user: User;
  color: number = config.color;
  logger: Logger = new Logger(config.logger);
  shieldbow: Client = new Client(process.env.API_KEY);
  commands: Collection<string, Command> = new Collection();
  cooldowns: Collection<Snowflake, CooldownUser> = new Collection();

  constructor() {
    super({
      token: process.env.AUTH,
      intents:
        GatewayIntents.GuildMembers |
        GatewayIntents.DirectMessages |
        GatewayIntents.Guilds
    });

    // Load commands
    const commandsPath = join(__dirname, '..', 'commands');
    readdirSync(commandsPath).forEach(async dir => {
      const commands = readdirSync(`${commandsPath}/${dir}`).filter(file => {
        return file.endsWith('.js');
      });

      for (const file of commands) {
        const { command } = await import(`${commandsPath}/${dir}/${file}`);
        this.commands.set(command.data.name, command);
      }
    });

    // Load events
    const eventsPath = join(__dirname, '..', 'events');
    readdirSync(eventsPath).forEach(async file => {
      const { event } = await import(`${eventsPath}/${file}`);
      this.events.on(event.name, event.exec.bind(null, this));
    });

    this.shieldbow.initialize({
      locale: 'en_US',
      fetch: {
        summonerSpells: false,
        champions: false,
        items: false,
        runes: false
      },
      cache: {
        enable: true,
        localRoot: 'cache'
      }
    });
  }
}
