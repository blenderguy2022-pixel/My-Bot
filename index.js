const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const prefix = "!";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// All commands (what users type)
const actions = {
  hug: "hugs",
  kiss: "kisses",
  slap: "slaps",
  cuddle: "cuddles",
  pat: "pats",
  punch: "punches",
  highfive: "highfives",
  waifu: "becomes a cute waifu for",
  wave: "waves at",
  angry: "is angry at",
  miss: "misses",
  hungry: "is hungry you should help them",
  yearn: "yearns for",
  bite: "bites",
  blush: "blushes because of",
  cry: "cries because of",
  dance: "dances with",
  smile: "smiles at",
  eepy: "feels eepy next to",
  thumbsup: "gives a thumbs up to",
  thinking: "is thinking about",
  lick: "licks",
  nom: "noms on",
  poke: "pokes",
  handholding: "holds hands with"
};

// Fallback map (unsupported → supported)
const fallbackMap = {
  miss: "cry",
  yearn: "cry",
  sleepy: "sleep",
  thumbsup: "smile",
  thinking: "smile",
  handholding: "handhold",
  hungry: "nom"
};

// Fetch GIF with fallback logic
async function getGif(action) {
  const apiAction = fallbackMap[action] || action;

  // Try nekos.best first
  try {
    const nekoUrl = `https://nekos.best/api/v2/${apiAction}`;
    const nekoRes = await fetch(nekoUrl);
    const nekoData = await nekoRes.json();

    if (nekoData.results && nekoData.results.length > 0) {
      return nekoData.results[0].url;
    }
  } catch (err) {
    console.log("Nekos.best failed, trying waifu.pics...");
  }

  // Fallback to waifu.pics
  try {
    const waifuUrl = `https://api.waifu.pics/sfw/${apiAction}`;
    const waifuRes = await fetch(waifuUrl);
    const waifuData = await waifuRes.json();

    if (waifuData.url) {
      return waifuData.url;
    }
  } catch (err) {
    console.log("Waifu.pics failed.");
  }

  return null;
}

// Create action embed
async function createActionEmbed(author, target, command) {
  const gif = await getGif(command);
  if (!gif) return null;

  return new EmbedBuilder()
    .setColor(0xff4d6d)
    .setDescription(
      `💖 **${author.username}** ${actions[command]} **${target.username}**`
    )
    .setImage(gif)
    .setFooter({ text: "Powered by nekos.best & waifu.pics" })
    .setTimestamp();
}

// Help embed
function createHelpEmbed() {
  return new EmbedBuilder()
    .setColor(0x7289da)
    .setTitle("✨ GIF Bot Commands ✨")
    .setDescription(
      `Use commands like:\n\`!hug @user\`\n\n**Available Commands:**\n\n` +
      Object.keys(actions)
        .map(cmd => `\`${prefix}${cmd}\``)
        .join("  ")
    )
    .setFooter({ text: "Made with ❤️" })
    .setTimestamp();
}

client.on("messageCreate", async message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args[0].toLowerCase();
  const target = message.mentions.users.first();

  if (command === "help") {
    return message.channel.send({
      embeds: [createHelpEmbed()]
    });
  }

  if (!actions[command]) return;

  if (!target)
    return message.reply("You must mention someone!");

  if (target.id === message.author.id)
    return message.reply("You can't use this on yourself 😭");

  const embed = await createActionEmbed(message.author, target, command);

  if (!embed)
    return message.reply("Both APIs failed. Try again later 😢");

  const button = new ButtonBuilder()
    .setCustomId(`return_${command}_${message.author.id}`)
    .setLabel(`🔁 ${command.charAt(0).toUpperCase() + command.slice(1)} Back`)
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  message.channel.send({
    embeds: [embed],
    components: [row]
  });
});

// Button interaction
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const [type, command, originalAuthorId] =
    interaction.customId.split("_");

  if (type !== "return") return;

  if (interaction.user.id === originalAuthorId) {
    return interaction.reply({
      content: "You can't return it to yourself 😅",
      ephemeral: true
    });
  }

  const originalAuthor = await client.users.fetch(originalAuthorId);

  const embed = await createActionEmbed(
    interaction.user,
    originalAuthor,
    command
  );

  if (!embed) {
    return interaction.reply({
      content: "Both APIs failed. Try again later 😢",
      ephemeral: true
    });
  }

  await interaction.reply({
    embeds: [embed]
  });
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);











