import { Interaction, MessageFlags } from '@biscuitland/core';
import { InteractionResponseTypes } from '@biscuitland/api-types';
import { Event } from '../interfaces/Event';

const ms = require('ms');

export const event: Event = {
  name: 'interactionCreate',
  exec: async (client, interaction: Interaction) => {
    try {
      if (interaction.isCommand()) {
        const args = [];
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        if (interaction.options.resolved) {
          Object.entries(interaction.options?.resolved).map(x => {
            args.push(x.values);
          });
        }
        const id = interaction.member.id;
        const cooldown = command.cooldown;
        if (cooldown === 0 ?? !!client.cooldowns.get(id)[command.data.name])
          return;

        if (
          client.cooldowns.has(id) &&
          Object.keys(client.cooldowns.get(id)).includes(command.data.name)
        ) {
          return await interaction.respond({
            data: {
              content: `Command is still on cooldown. Try again in \`${ms(
                client.cooldowns.get(id)[command.data.name].executedAt -
                  Date.now()
              )}\`.`,
              flags: MessageFlags.Ephemeral
            },
            type: InteractionResponseTypes.ChannelMessageWithSource
          });
        }

        if (!client.cooldowns.has(id)) client.cooldowns.set(id, {});

        client.cooldowns.get(id)[command.data.name] = {
          executedAt: Date.now() + cooldown * 1000,
          cooldown
        };

        setTimeout(
          () => delete client.cooldowns.get(id)[command.data.name],
          cooldown * 1000
        );

        command.exec(client, interaction, args);
        client.logger.silly(
          `${interaction.member.user.tag} used command '${command.data.name}'`
        );
      }
    } catch (e) {
      client.logger.prettyError(e);
    }
  }
};
