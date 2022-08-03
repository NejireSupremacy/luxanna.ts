import { ChatInputApplicationCommandBuilder } from '@biscuitland/core';
import { Command } from '../../interfaces/Command';
import { codeString } from '../../utils/functions';
import { Region, ApiError } from 'shieldbow';
import { regions } from '../../utils/regions';

export const command: Command = {
  data: new ChatInputApplicationCommandBuilder()
    .setName('profile')
    .setDescription('Summoner profile with ranks, champions, last game, etc')
    .addStringOption(option => {
      return option
        .setName('summoner-name')
        .setDescription('Name of the summoner to get the profile of')
        .setRequired(true);
    })
    .addStringOption(option => {
      return option
        .setName('region')
        .setDescription('Region of the summoner to get the profile of')
        .setRequired(true);
    })
    .toJSON(),
  category: 'LoL',
  cooldown: 5,
  exec: async (client, interaction) => {
    await interaction.defer();

    const summoner_name = interaction.options.getString('summoner-name', true);
    const summoner_region = interaction.options
      .getString('region', true)
      .toLowerCase() as Region;

    if (!regions.includes(summoner_region)) {
      return interaction.sendFollowUp({
        content: `\`${summoner_region}\` is not a valid region.`
      });
    }

    try {
      var {
        name,
        profileIcon,
        level,
        region
      } = await client.shieldbow.summoners.fetchBySummonerName(
        encodeURIComponent(summoner_name),
        {
          region: summoner_region
        }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.response.status === 404) {
          return await interaction.sendFollowUp({
            content: `${codeString(
              `ApiError ${error.response.status}:`
            )} The summoner ${codeString(
              summoner_name
            )} could not be found in ${codeString(
              summoner_region.toUpperCase()
            )}.`
          });
        }
      }
    }

    await interaction.sendFollowUp({
      embeds: [
        {
          title: `${client.user.username} Profile`,
          thumbnail: {
            url: profileIcon
          },
          fields: [
            {
              name: '> Basic Information',
              value: [
                `${codeString('Name:')} ${name}`,
                `${codeString('Level:')} ${level}`,
                `${codeString('Region:')} ${region.toUpperCase()}`,
                `${codeString('Icon URL:')} [View here](${profileIcon})`
              ].join('\n')
            }
          ],
          color: client.color
        }
      ]
    });
  }
};
