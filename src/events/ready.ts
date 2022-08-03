import { Event } from '../interfaces/Event';
import { ActivityTypes } from '@biscuitland/api-types';

export const event: Event = {
  name: 'ready',
  exec: async (client, args) => {
    client.user = args.user;

    for (const { id } of client.ws.agent.shards.values()) {
      client.logger.info(`[Shard: ${id}] Logged in as: ${args.user.tag}`);
      client.editStatus(
        id,
        {
          status: 'dnd',
          activities: [
            {
              name: 'league of legends',
              createdAt: Date.now(),
              type: ActivityTypes.Game
            }
          ]
        },
        true
      );
    }

    await client.upsertApplicationCommands(
      client.commands.map(command => {
        return command.data;
      })
    );
  }
};
