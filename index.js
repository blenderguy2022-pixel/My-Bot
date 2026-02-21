const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));
const cron = require("node-cron");
const fs = require("fs");

const prefix = "!";
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// ----------------- CONFIG -----------------
const girlfriendId = "798197794649276456"; // Replace with your girlfriend's ID

// ----------------- LOVE MESSAGES -----------------
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

const goodMorningMessages = [
  "Good morning, my love! 🌅 You are always my first thought after waking up 💖 ~Your Ari",
  "Gurmornin babyyy!! Rise and shine cutie! Daily reminder that my heart is always with you 😘 ~Your Ari",
  "Good morninggg my Myruuu! I hope my beautiful girlfriend has a beautiful day today 💕 ~Your Ari",
  "Wake up, my darling 😚 Sending you a hug and all my love 💌 ~Your Ari",
  "Good Morningg jaanu! 🌞 I loveee youuu soooo muchhhh. Hope you like waking up to my love ❤️ ~Your Ari"
];

const goodNightMessages = [
  "Good night, my love 🌙 I might or might not be here right now , but I always hold you in my heart 💖 ~Your Ari",
  "Sweet dreams, cutie 😘 Remember, you’re mine forever and I am yours. Even in our dreams ❤️ ~Your Ari",
  "Good night my love 🌌 I might be asleep right now , but just know I am dreaming of you , and I'll protect and love you even in my dreams 💌 ~Your Ari",
  "Take care and Sleep well my darling 🌙 As the world gets dark , our love grows brighter and in this silence , our hearts beat together 💖 ~Your Ari",
  "Good night sweetheart 🌠 I love you when I am awake and even more when I am asleep 😚 ~Your Ari"
];

// ----------------- COMMANDS -----------------
const actions = {
  hug: "hugs",
  kiss: "cisses",
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
  pussywank: "does naughty things with",
  blowjob: "gives a blowjob to",
  fuck: "fucks",
  boobs: "shows boobs to",
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

const fallbackMap = { miss: "cry", yearn: "cry", reassure: "hug", sleepy: "sleep", thumbsup: "smile", thinking: "smile", handholding: "handhold", hungry: "nom" };

// NSFW command list
const nsfwActions = ["pussywank", "blowjob", "fuck", "boobs"];

// Stats
let stats = { hug: 0, kiss: 0, reassure: 0 };
if (fs.existsSync("./stats.json")) stats = JSON.parse(fs.readFileSync("./stats.json", "utf-8"));

// ----------------- HELPERS -----------------
async function getGif(action) {
  const apiAction = fallbackMap[action] || action;

  // NSFW first
  if (nsfwActions.includes(action)) {
    try {
      const res = await fetch(`https://nekos.best/api/v2/nsfw/${apiAction}`);
      const data = await res.json();
      if (data.results && data.results.length > 0) return data.results[0].url;
    } catch {}
    try {
      const res = await fetch(`https://nekos.life/api/v2/img/${apiAction}`);
      const data = await res.json();
      if (data.url) return data.url;
    } catch {}
    return null;
  }

  // SFW fallback
  try {
    const res = await fetch(`https://nekos.best/api/v2/${apiAction}`);
    const data = await res.json();
    if (data.results && data.results.length > 0) return data.results[0].url;
  } catch {}
  try {
    const res = await fetch(`https://api.waifu.pics/sfw/${apiAction}`);
    const data = await res.json();
    if (data.url) return data.url;

    const res2 = await fetch(`https://api.waifu.pics/nsfw/${apiAction}`);
    const data2 = await res2.json();
    if (data2.url) return data2.url;
  } catch {}
  return null;
}

function getRandomMessage(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function createActionEmbed(author, target, command, includeMessage = false) {
  const gif = await getGif(command);
  if (!gif) return null;

  const embed = new EmbedBuilder()
    .setColor(0xff4d6d)
    .setDescription(`💖 **${author.username}** ${actions[command]} **${target.username}**`)
    .setImage(gif)
    .setFooter({ text: "Powered by nekos.best & waifu.pics" })
    .setTimestamp();

  if (includeMessage) embed.setDescription(embed.data.description + `\n\n💌 ${getRandomMessage(loveReassurances)}`);
  return embed;
}

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
    await user.send({ embeds: [embed] });
  } catch (err) { console.log(err); }
}

function createHelpEmbed() {
  return new EmbedBuilder()
    .setColor(0x7289da)
    .setTitle("✨ GIF Bot Commands ✨")
    .setDescription(`Use commands like:\n\`!hug @user\`\n\n**Available Commands:**\n\n` + Object.keys(actions).map(cmd => `\`${prefix}${cmd}\``).join("  "))
    .setFooter({ text: "Made with ❤️" })
    .setTimestamp();
}

// ----------------- EVENT LISTENERS -----------------
client.on("messageCreate", async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args[0].toLowerCase();
  const target = message.mentions.users.first();

  if (command === "help") return message.channel.send({ embeds: [createHelpEmbed()] });
  if (!actions[command]) return;

  // NSFW handling
  if (nsfwActions.includes(command)) {
    if (!target) return message.reply("You must mention someone!");
    const gif = await getGif(command);
    if (!gif) return message.reply("NSFW API failed or no GIF found 😢");
    const embed = new EmbedBuilder()
      .setColor(0xff4d6d)
      .setDescription(`💖 **${message.author.username}** ${actions[command]} **${target.username}**`)
      .setImage(gif)
      .setTimestamp();
    return message.channel.send({ embeds: [embed] });
  }

  // Stats increment
  if (stats[command] !== undefined) { stats[command]++; fs.writeFileSync("./stats.json", JSON.stringify(stats, null, 2)); }

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
  } catch (err) { console.log(err); interaction.reply({ content: "Something went wrong 😢", ephemeral: true }); }
});

// ----------------- DAILY CRON -----------------
cron.schedule("0 7 * * *", () => sendDailyMessage(goodMorningMessages), { timezone: "Asia/Kolkata" });
cron.schedule("0 1 * * *", () => sendDailyMessage(goodNightMessages), { timezone: "Asia/Kolkata" });

client.once("ready", () => console.log(`Logged in as ${client.user.tag}`));
client.login(process.env.TOKEN);
