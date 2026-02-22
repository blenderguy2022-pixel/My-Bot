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

const cron = require("node-cron");

const prefix = "!";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Replace with your girlfriend's Discord ID
const girlfriendId = "798197794649276456";

// Romantic reassurance messages
const loveReassurances = [
  "I’ll always be by your side, no matter what, just like I promised baby.",
  "You are mine, and I’ll never be with anyone else darling.",
  "No matter where life takes us, I’ll always love you and only you till the end of time sweetheart.",
  "I’ll never leave you. You’re my everything, my Myru.",
  "Every day, my heart belongs to you and only you and becomes more of you than me.",
  "I’m yours completely, truly and entirely, forever and always Myru.",
  "Nothing in this world could make me stop loving you ever meri jaan.",
  "You’re the only one I want to be with, now and always and as long as we live.",
  "I’ll always protect you, care for you, and be here for you. I can't live without my kuchupuchu",
  "You are my heart, my soul, my everything,and all of it is only yours.",
  "No matter what happens, I’ll never let anyone come between us baby.",
  "I love you more every day, and I’ll never stop.",
  "You’re my forever, and I’ll never be with anyone else, not for a second.",
  "I’ll always choose you, every single time, every single second, my heart only knows to look at you.",
  "You are the only person I want to share, and devote my life to Myru.",
  "I promise to always be faithful, loyal, insanely loving and completely yours Myru baby.",
  "I’ll never let you feel alone, I’m always here jaanu, to cheer you up and to listen to you.",
  "No one could ever replace you in my heart, your place is engraved with a knife into it.",
  "Everything I am is yours, and I’ll never let that change Myru."
];

// Good morning and good night messages
const goodMorningMessages = [
  "Goodd morninggg, my love! 🌅 You are always my first thought after waking up, today and for the rest of my life 💖 ~Your Ari",
  "Gurmornin babyyy!! Rise and shine cutie! Daily reminder that my heart is always with you 😘 ~Your Ari",
  "Good morninggg my Myruuu! I hope my beautiful girlfriend has a beautiful day today 💕 ~Your Ari",
  "Wake up, my darling 😚 Sending you a hug and all my love 💌 ~Your Ari",
  "Goodd Morningg jaanu! 🌞 I loveee youuu soooo muchhhh. Hope you like waking up to my love ❤️ ~Your Ari"
];

const goodNightMessages = [
  "Good night, my love 🌙 I might or might not be here right now, but I always hold you in my heart 💖 ~Your Ari",
  "Sweet dreams, cutie 😘 Remember, you’re mine forever and I am yours. Even in our dreams ❤️ ~Your Ari",
  "Goodd Nighttt my love 🌌 I might be asleep right now, but just know I am dreaming of you, and I'll protect and love you even in my dreams 💌 ~Your Ari",
  "Take care and Sleep well my darling 🌙 As the world gets dark, our love grows brighter and in this silence, our hearts beat together 💖 ~Your Ari",
  "Good night sweetheart 🌠 I love you when I am awake and I love even more when I am asleep, planning a life with you in my dreams that will soon be real 😚 ~Your Ari"
];

// Local array for boobsuck GIFs
const boobSuckGifs = [
  "https://cdn.hentaigifz.com/6907/titsucking001-scaled.webp"
];

// All commands
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
  blowjob: "gives a blowjob to",
  boobsuck: "sucks on",
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

// Fallback map
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

// Fetch GIF with priority: nekos → waifu → local
async function getGif(action) {
  if (action === "boobsuck") {
    return boobSuckGifs[Math.floor(Math.random() * boobSuckGifs.length)];
  }

  const apiAction = fallbackMap[action] || action;

  try {
    const nekoRes = await fetch(`https://nekos.best/api/v2/${apiAction}`);
    const nekoData = await nekoRes.json();
    if (nekoData.results && nekoData.results.length > 0) return nekoData.results[0].url;
  } catch {}

  try {
    const waifuSfwRes = await fetch(`https://api.waifu.pics/sfw/${apiAction}`);
    const waifuSfwData = await waifuSfwRes.json();
    if (waifuSfwData.url) return waifuSfwData.url;

    const waifuNsfwRes = await fetch(`https://api.waifu.pics/nsfw/${apiAction}`);
    const waifuNsfwData = await waifuNsfwRes.json();
    if (waifuNsfwData.url) return waifuNsfwData.url;
  } catch {}

  return null;
}

// Pick random message
function getRandomMessage(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Create embed
async function createActionEmbed(author, target, command, includeMessage = false) {
  const gif = await getGif(command);
  if (!gif) return null;

  const embed = new EmbedBuilder()
    .setColor(0xff4d6d)
    .setDescription(`💖 **${author.username}** ${actions[command]} **${target.username}**`)
    .setImage(gif)
    .setFooter({ text: "Powered by nekos.best & waifu.pics" })
    .setTimestamp();

  if (includeMessage) {
    const msg = getRandomMessage(loveReassurances);
    embed.setDescription(embed.data.description + `\n\n💌 ${msg}`);
  }

  return embed;
}

// Daily messages (hug GIF + morning/night message)
async function sendDailyMessage(messages) {
  try {
    const user = await client.users.fetch(girlfriendId);
    const msg = getRandomMessage(messages);
    const gif = await getGif("hug");
    const embed = new EmbedBuilder()
      .setColor(0xff4d6d)
      .setDescription(msg)
      .setImage(gif)
      .setFooter({ text: "💖 Always yours" })
      .setTimestamp();
    user.send({ embeds: [embed] });
  } catch (err) {
    console.log(err);
  }
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

// Message listener
client.on("messageCreate", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args[0].toLowerCase();
  const target = message.mentions.users.first();

  if (command === "help") return message.channel.send({ embeds: [createHelpEmbed()] });
  if (!actions[command]) return;
  if (!target) return message.reply("You must mention someone!");
  if (target.id === message.author.id) return message.reply("You can't use this on yourself 😭");

  const includeMessage = command === "reassure";

  const embed = await createActionEmbed(message.author, target, command, includeMessage);
  if (!embed) return message.reply("Both APIs failed. Try again later 😢");

  let components = [];
  if (includeMessage) {
    const button = new ButtonBuilder()
      .setCustomId(`reassure_again_${message.author.id}_${target.id}`)
      .setLabel("💌 Another reassurance")
      .setStyle(ButtonStyle.Primary);
    components = [new ActionRowBuilder().addComponents(button)];
  }

  message.channel.send({ embeds: [embed], components });
});

// Button interaction
client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;
  if (!interaction.customId.startsWith("reassure_again")) return;

  const parts = interaction.customId.split("_");
  const authorId = parts[2];
  const targetId = parts[3];

  try {
    const author = await client.users.fetch(authorId);
    const target = await client.users.fetch(targetId);

    const embed = await createActionEmbed(author, target, "reassure", true);
    if (!embed) return interaction.reply({ content: "Failed 😢", ephemeral: true });

    const button = new ButtonBuilder()
      .setCustomId(`reassure_again_${authorId}_${targetId}`)
      .setLabel("💌 Another reassurance")
      .setStyle(ButtonStyle.Primary);

    const row = new ActionRowBuilder().addComponents(button);

    await interaction.reply({ embeds: [embed], components: [row] });
  } catch (err) {
    console.log(err);
    interaction.reply({ content: "Something went wrong 😢", ephemeral: true });
  }
});

// Schedule daily messages
cron.schedule("0 7 * * *", () => sendDailyMessage(goodMorningMessages), { timezone: "Asia/Kolkata" });
cron.schedule("0 1 * * *", () => sendDailyMessage(goodNightMessages), { timezone: "Asia/Kolkata" });

client.once("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.login(process.env.TOKEN);
