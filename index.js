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

// Load your romantic reassurance messages
const loveReassurances = [
  "I’ll always be by your side, no matter what, just like I promised baby.",
  "You are mine, and I’ll never be with anyone else darling.",
  "No matter where life takes us, I’ll always love you and only you till the end of time sweetheart.",
  "I’ll never leave you. You’re my everything, my Myru.",
  "Every day, my heart belongs to you and only you and becomes more of you than me.",
  "I’m yours completely , truly and entirely, forever and always Myru.",
  "Nothing in this world could make me stop loving you ever meri jaan.",
  "You’re the only one I want to be with, now and always and as long as we live.",
  "I’ll always protect you, care for you, and be here for you. I can't live without my kuchupuchu",
  "You are my heart, my soul, my everything,and all of it is only yours.",
  "No matter what happens, I’ll never let anyone come between us baby. Its just us and beautiful life with your future pets",
  "I love you more every day, and I’ll never stop , because I simply can't stop falling more and more for this marvelous girl.",
  "You’re my forever, and I’ll never be with anyone else , not for a second.",
  "I’ll always choose you, every single time , every single second , my heart only knows to look at you.",
  "You are the only person I want to share , and devote my life to Myru.",
  "I promise to always be faithful, loyal, insanely loving and completely yours Myru baby.",
  "I’ll never let you feel alone, I’m always here jaanu, to cheer you up and to listen to you.",
  "No one could ever replace you in my heart , your place is engraved with a knife into it.",
  "Everything I am is yours, and I’ll never let that change Myru."
];

// All commands (what users type)
const actions = {
  hug: "hugs",
  kiss: "kisses",
  slap: "slaps",
  cuddle: "cuddles",
  pat: "pats",
  punch: "punches",
  reassure: "reassures you that he's only your boyfie forever",
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

// Fallback map (unsupported → supported)
const fallbackMap = {
  miss: "cry",
  yearn: "cry",
  reassure: "hug",
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
  } catch {
    console.log("Nekos.best failed, trying waifu.pics...");
  }

  // Fallback to waifu.pics SFW
  try {
    const waifuSfwUrl = `https://api.waifu.pics/sfw/${apiAction}`;
    const waifuSfwRes = await fetch(waifuSfwUrl);
    const waifuSfwData = await waifuSfwRes.json();

    if (waifuSfwData.url) return waifuSfwData.url;

    // Fallback to waifu.pics NSFW
    const waifuNsfwUrl = `https://api.waifu.pics/nsfw/${apiAction}`;
    const waifuNsfwRes = await fetch(waifuNsfwUrl);
    const waifuNsfwData = await waifuNsfwRes.json();

    if (waifuNsfwData.url) return waifuNsfwData.url;
  } catch {
    console.log("Waifu.pics failed.");
  }

  return null;
}

// Create action embed
async function createActionEmbed(author, target, command, includeMessage = false) {
  const gif = await getGif(command);
  if (!gif) return null;

  const embed = new EmbedBuilder()
    .setColor(0xff4d6d)
    .setDescription(`💖 **${author.username}** ${actions[command]} **${target.username}**`)
    .setImage(gif)
    .setFooter({ text: "Powered by nekos.best & waifu.pics" })
    .setTimestamp();

  // If this is a reassurance, include a random romantic message
  if (includeMessage) {
    const randomMsg = loveReassurances[Math.floor(Math.random() * loveReassurances.length)];
    embed.setDescription(embed.data.description + `\n\n💌 ${randomMsg}`);
  }

  return embed;
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

  // Check if it's the reassurance command
  const includeMessage = command === "reassure";

  const embed = await createActionEmbed(message.author, target, command, includeMessage);

  if (!embed)
    return message.reply("Both APIs failed. Try again later 😢");

  const button = new ButtonBuilder()
    .setCustomId(`reassure_again_${message.author.id}_${target.id}`)
    .setLabel("💌 Another reassurance")
    .setStyle(ButtonStyle.Primary);

  const row = new ActionRowBuilder().addComponents(button);

  message.channel.send({
    embeds: [embed],
    components: includeMessage ? [row] : []
  });
});

// Button interaction for another reassurance
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  if (!interaction.customId.startsWith("reassure_again")) return;

  const parts = interaction.customId.split("_");
  const authorId = parts[2]; // message.author.id
  const targetId = parts[3]; // target.id

  try {
    const author = await client.users.fetch(authorId);
    const target = await client.users.fetch(targetId);

    const embed = await createActionEmbed(author, target, "reassure", true);

    if (!embed) {
      return interaction.reply({
        content: "Failed to fetch another reassurance 😢",
        ephemeral: true
      });
    }

    // Create the button again so it appears on this new embed too
    const button = new ButtonBuilder()
      .setCustomId(`reassure_again_${authorId}_${targetId}`)
      .setLabel("💌 Another reassurance")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    // Send the embed with the button
    await interaction.reply({ embeds: [embed], components: [row] });

  } catch (err) {
    console.log(err);
    return interaction.reply({
      content: "Something went wrong 😢",
      ephemeral: true
    });
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(process.env.TOKEN);




