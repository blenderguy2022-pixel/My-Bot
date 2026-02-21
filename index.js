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
  blowjob: "gives a blowjob to",
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

// Helper to get a random NHentai image
async function getNhentaiImage() {
  try {
    const randomId = Math.floor(Math.random() * 500000) + 1; // Random doujin ID
    const res = await fetch(`https://nhentai.net/api/gallery/${randomId}`);
    if (!res.ok) return null;

    const data = await res.json();
    if (!data.media || !data.media.pages || data.media.pages.length === 0) return null;

    const page = data.media.pages[0];
    const ext = page.t === "j" ? "jpg" : page.t === "p" ? "png" : "gif";
    const imageUrl = `https://i.nhentai.net/galleries/${data.media_id}/${page.num}.${ext}`;
    return imageUrl;
  } catch (err) {
    console.log("NHentai fetch failed:", err.message);
    return null;
  }
}

// Main function to get a GIF/image
async function getGif(action) {
  const apiAction = fallbackMap[action] || action;

  // Define API attempts in order
  const attempts = [
    async () => { // nekos.best
      const res = await fetch(`https://nekos.best/api/v2/${apiAction}`);
      const data = await res.json();
      return data.results?.[0]?.url || null;
    },
    async () => { // waifu.pics SFW
      const res = await fetch(`https://api.waifu.pics/sfw/${apiAction}`);
      const data = await res.json();
      return data.url || null;
    },
    async () => { // waifu.pics NSFW
      const res = await fetch(`https://api.waifu.pics/nsfw/${apiAction}`);
      const data = await res.json();
      return data.url || null;
    },
    async () => { // NHentai NSFW
      return await getNhentaiImage();
    }
  ];

  // Try each API in order until one returns a URL
  for (const attempt of attempts) {
    try {
      const url = await attempt();
      if (url) return url;
    } catch (err) {
      // Ignore errors and move to next API
    }
  }

  return null; // All failed
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














