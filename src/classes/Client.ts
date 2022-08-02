import { Biscuit, Snowflake, User } from "@biscuitland/core";
import { Collection } from "./Collection";
import config from "../config";
import { Client } from "shieldbow";
import { Logger } from "tslog";

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
    super({ token: process.env.AUTH, intents: 33481 });
  }
}
