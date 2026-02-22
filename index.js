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
  "https://cdn.hentaigifz.com/6907/titsucking001-scaled.webp",
  "https://cdn.hentaigifz.com/90076/sucking-tits-by-akiba-kei-kanojo.gif",
  "https://img.xbooru.com//images/644/b2ed50a2ffbd78faed28ed44460aa164.gif?835612",
  "https://tbib.org//images/2005/bfc109a39c43bf8f606a26cf9465b61ebaf59ad0.gif",
  "https://tbib.org//images/3478/bf56804b152cf8467102f6baa69b4dde2c18d16b.gif?3991920",
  "https://wimg.rule34.xxx//images/3337/1f8ea2760660bc5130e221af0735195f.gif?9742611",
  "https://img.xbooru.com//images/585/14b2e2647661b024cc759c24785060e9.gif?640897",
  "https://img.xbooru.com//images/569/83bc1ce3f8fedb0f224dacad9dc1bb5a.gif?833674",
  "https://cdn.hentaigifz.com/46757/suckingonsomemommymilkers001.gif",
  "https://cdn.hentaigifz.com/80182/tit-sucking.gif",
  "https://img.xbooru.com//images/172/10e5f4703b9ac152d2bf36571bae8467.gif?184020",
  "https://img.xbooru.com//images/169/3c656e84b21a0ef094d88d107363e163.gif?180735",
  "https://64.media.tumblr.com/tumblr_m82316GYc61r2v293o1_400.gif",
  "https://tbib.org//images/3476/6a3bd297c182736a590b5a6aeab8b1732d996350.gif",
  "https://tbib.org//images/1079/1f543075ee12d02647941f0840766663ceaeb016.gif",
  "https://tbib.org//images/1079/a5e8a4fc61ee68acb1d4bfad86911cf24f880dbe.gif",
  "https://64.media.tumblr.com/6b6e9e8e8e9c50e240db5e45aa6da23e/tumblr_mne35mvbIc1s0sk8ho1_500.gif",
  "https://wimg.rule34.xxx//images/1054/506800696ebbebdc6ee4349cb9b254cbd3522df3.gif?1054356",
  "https://img.xbooru.com//images/428/c5cfc8ebe2a5106a47ec6bba23f5f32f.gif?469957",
  "https://cdn.hentaigifz.com/94256/using-tongue-as-pressure-suck.gif",
  "https://i.redd.it/5npzbgg1azx31.gif",
  "https://i.redd.it/qiwxsceft2ad1.gif",
  "https://img.xbooru.com//images/428/8f0ced7b56efe81a7325c4eea3d65593.gif?469122",
  "https://cdn.hentaigifz.com/90066/licking-nipple-by-akiba-kei-kanojo.gif",
  "https://wimg.rule34.xxx//images/2620/f83dfd61a3d8e67fb97a578d5874c49f.gif?2911692"
];

//Local Array for Pussy eating gifs 
const eatoutgifs = [
  "https://s3.truyen-hentai.com/6983d2001ac5d124268322.gif",
  "https://cdn.hentaigifz.com/90738/pussy-licking-by-akiba-kei-kanojo.gif",
  "https://cdn.hentaigifz.com/106128/she-enjoys-getting-her-pussy-eaten.gif",
  "https://cdn.hentaigifz.com/59460/eat-dat-pussy-d.gif",
  "https://i.redd.it/t0klz104yk9b1.gif",
  "https://cdn.hentaigifz.com/88490/sweet-hentai-lick.gif",
  "https://cdn.hentaigifz.com/79074/lick-more.gif",
  "https://cdn.hentaigifz.com/104838/pussy-licking.gif",
  "https://cdn.hentaigifz.com/100486/doll-pussy-being-licked.gif",
  "https://i.redd.it/ao8u4t4v1xwd1.gif",
  "https://cdn.hentaigifz.com/106126/anime-female-gets-pussy-eaten.gif",
  "https://img.xbooru.com//images/514/878ce87ecc7291614cabc045da8e6598.gif?562665",
  "https://cdn.hentaigifz.com/44831/hentai00115.gif",
  "https://i.redd.it/j8k7a8f0sfqb1.gif",
  "https://imagex1.sx.cdn.live/images/pinporn/2020/05/13/23017759.gif?width=460",
  "https://i.redd.it/y86l95a8ex2d1.gif",
  "https://i.redd.it/y6iuivxee7o71.gif",
 "https://i.redd.it/t0klz104yk9b1.gif",
  "https://i.redd.it/9g42bnhwibid1.gif",
  "https://i.redd.it/3lr0y1s2k9ua1.gif",
 "https://imagex1.sx.cdn.live/images/pinporn/2019/11/07/22115159.gif?width=460",
  "https://cdn.hentaigifz.com/59460/eat-dat-pussy-d.gif",
  "https://i.redd.it/awuqwowcw8qf1.gif",
  "https://imagex1.sx.cdn.live/images/pinporn/2014/05/20/6092319.gif?width=460",
  "https://cdn.hentaigifz.com/94638/pulling-open-labia.gif",
  "https://cdn.hentaigifz.com/100494/uncensored.gif",
  "https://img.xbooru.com//images/183/dbfd656e04c342e387638cc451e8fb97.gif?195809",
  "https://cdn.hentaigifz.com/82484/pussy-scaled.webp",
  "https://cdn.hentaigifz.com/72478/sisters-natsu-no-saigo-no-hi-scaled.webp",
  "https://hardgif.com/fallback_screenshot.php?post_id=94743872",
  "https://i.redd.it/98axg9zbl00g1.gif",
  "https://img.xbooru.com//images/222/ba2c5ffe3ee4e85f987921ed9f4e2437.gif?335144",
  "https://www.hentaiporn.com.es/koothoov/2024/05/Hentai-Blonde-1boy-1boy1girl-1girl-69-69-position-aisai.gif",
  "https://s3.truyen-hentai.com/6844b9a36b376822737250.gif",
  "https://img.xbooru.com//images/516/e1a4ddb681594f2b40f343199942e744.gif?564759",
  "https://i.redd.it/846p337704z31.gif",
  "https://img.xbooru.com//images/163/4c3fa820ef331da77a3bd7260830ab50.gif?173337",
  "https://wimg.rule34.xxx//images/1029/653f455498b4303f1ed65087e8f516c3dc0548bc.gif?1028531",
  "https://tbib.org//images/3387/1c53a8443d76292c01f96fe74593a673e216f486.gif",
  "https://wimg.rule34.xxx//images/2940/bce73d6ababfabe4eee2719e0dd88055.gif?3286270",
  "https://img.xbooru.com//images/196/fe0b626e37b4e3e82435325f2318a74e.gif?210086",
  "https://tbib.org//images/2613/18dc1865585f7084633f96e2594bc1343fd5b04a.gif",
  "https://tbib.org//images/3730/f3a9b6ad57befe4d8efad728ec8df06e8bbd5e51.gif",
  "https://tbib.org//images/872/77fda5caff0ea56ca07db73527305e1e1626b5c4.gif",
  "https://img0.thatpervert.com/pics/post/hentai-gif-hentai-Yuri-hentai--2672132.gif",
  "https://i.redd.it/4wlhcd3pxnxc1.gif",
  "https://tbib.org//images/1996/0563c8c292220e9b01d31a3d384acc245e7b0adf.gif"
];

//Local array for fucking gifs
const fuckgifs = [
  "https://cdn.hentaigifz.com/46199/animefuck001.gif",
  "https://cdn.hentaigifz.com/96/sexyanimefemalefuckinghard001.gif",
  "https://otakusexart.com/wp-content/uploads/2019/09/hentai-onahole-doggystyle-sex-anime-fuck-gif.gif",
  "https://cdn.hentaigifz.com/72180/fuck.gif",
  "https://myteenwebcam.com/fapp/gifs/521d40bc16d520b31110014dc80409a1.gif",
  "https://cdn.hentaigifz.com/107578/anime-teen-fucked.gif",
  "https://cdn.hentaigifz.com/65596/sexy-petite-teen-fucked-from-behind.gif",
  "https://cdn.hentaigifz.com/1967/doggystylefuckingwithananimegirl001.gif",
  "https://i.redd.it/qlmlut1c2vt71.gif",
  "https://imagex1.sx.cdn.live/images/pinporn/2013/10/07/3788004.gif?width=460",
  "https://cdn.hentaigifz.com/60574/hentai-gif-cute-anime-girl-fucked-penetration-wet-pussy.gif",
  "https://megaboobscartoons.com/gals/wp-content/uploads/2015/10/tumblr_n71j969JT71toy0ydo1_500.gif",
  "https://cdn.hentaigifz.com/58870/teen.gif",
  "https://cdn.hentaigifz.com/61346/busty-cartoon-teen-xxx-sex-gif.gif",
  "https://myteenwebcam.com/fapp/gifs/521d40bc16d520b31110014dc80409a1.gif",
  "https://img1.thatpervert.com/pics/post/Anime-hentai-gif-anime-1090687.gif",
  "https://cdn.hentaigifz.com/4712/thehoneymoonsuite001.gif",
  "https://img.xbooru.com//images/171/a619ce7f12d1d2f9e15656d9aae280f4.gif?182442",
  "https://www.hentairider.com/media/images/3/gif-anime-hentai/gif-anime-hentai-77815.gif",
  "https://imagex1.sx.cdn.live/images/pinporn/2021/10/03/25998138.gif?width=460",
  "https://hentaiwikis.com/wp-content/uploads/2022/08/GIFS/hentai%20gif%20porn%20(96).gif",
  "https://wimg.rule34.xxx//images/1169/3ff39c4eaa2c72fb0ec9f28198d32d4dc174e8c0.gif?1176544",
  "https://img10.joyreactor.com/pics/post/erotic-nsfw-ecchi-3436214.gif",
  "https://hentaiporns.net/wp-content/uploads/2018/01/6894690-d7eb1ac49f49fe263af1b65d6ffacdfa.gif",
  "https://xxxpicss.com/xxx/female-anime-girls-porn-gifs-naked-anime-women-sex-gif-sexy-anime-kiss-gif.gif",
  "https://cdn.hentaigifz.com/113271/teenie-fucked.gif",
  "https://blovjob.com/content/2022/09/hentai-gif_001.gif",
  "https://cdn.hentaigifz.com/64804/petite.gif",
  "https://cdn.hentaigifz.com/109240/petite-fucked.gif",
  "https://cdn.hentaigifz.com/108112/tiny-babe.gif",
  "https://cdn.hentaigifz.com/73498/hentai-gif-39.gif",
  "https://i.redd.it/v1tg54fdcrle1.gif",
  "https://tbib.org//images/1419/32192f9219f5e6c69d9f9c10551c338449fa27ee.gif",
  "https://64.media.tumblr.com/f946d5951f5e813e391f9c4f803ffcd0/tumblr_mvmfa25BwG1sysr50o1_500.gif",
  "https://blovjob.com/content/2022/12/himeno-kisara-eroge-h-mo-game-mo-kaihatsu-zanmai-animated-animated_001.gif",
  "https://i.redd.it/hbbbd405o5cg1.gif",
  "https://i.redd.it/q0174o2wlbl91.gif",
  "https://cdn.hentaigifz.com/14087/ana001.gif",
  "https://cdn.hentaigifz.com/81760/niizuma-koyomi.gif",
  "https://i.redd.it/ukdmla02w9y41.gif"
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
  eatout: "is absolutely devouring",
  thumbsup: "gives a thumbs up to",
  thinking: "is thinking about",
  fuck: "is sweating and panting because of",
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

  if (action === "eatout") {
    return eatoutgifs[Math.floor(Math.random() * eatoutgifs.length)];
  }

   if (action === "fuck") {
    return fuckgifs[Math.floor(Math.random() * fuckgifs.length)];
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








