console.log("INITIALIZING");
const Discord = require("discord.js");
const config = require("./config.json");
const {MongoClient} = require('mongodb');

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"]});

const prefix = "!";

console.log("ATTEMPTING LOGIN");
client.login(config.BOT_TOKEN);
console.log("LOGIN SUCCESSFUL");

var membersList = [];
var choresList = [];

async function addChore(client, newChore){
    const result = await client.db("chorechief").collection("chores").insertOne(newChore);
    console.log("Chore Added");
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");

    databasesList.databases.forEach(db => {
        console.log(`- ${db.name}`);
    })
}

async function listMembers(message) {
    const client = await databaseConnect();
    const MembersList = await client.db("chorechief").collection("members").find({}).toArray();
    var list = ["Members:"];
    MembersList.forEach( ml => {
        list.push(`- ${ml.Name}`);
    });
    message.reply(list.join('\n'));
}

async function listChores(message) {
    const client = await databaseConnect();
    const ChoresList = await client.db("chorechief").collection("chores").find({}).toArray();
    var list = ["Chores:"];
    ChoresList.forEach( cl => {
        list.push(`- ${cl.Name}`);
    });
    message.reply(list.join('\n'));
}

async function addMember(newMember){
    const client = await databaseConnect();
    await client.db("chorechief").collection("members").insertOne(newMember);
}

async function addChore(newChore){
    const client = await databaseConnect();
    await client.db("chorechief").collection("chores").insertOne(newChore);
}

async function databaseConnect(){
    const uri = "mongodb+srv://ChoreChief:chorechief@cluster0.4rbm1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

    const client = new MongoClient(uri);

    try{
        await client.connect();
    }catch(e){
        console.error(e);
    }finally{
        await client.close();
    }
    await client.connect();
    return client;
}

client.on("messageCreate", function(message) {
    if(message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;

    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();
    console.log(`ATTEMPTED COMMAND: ${command}`);
    if (command === "ping") {
        const timeTaken = Date.now() - message.createdTimestamp;
        message.reply(`Poggers! This message had a latency of ${timeTaken}ms.`);
    }
    else if (command === "pong") {
        let user = client.users.cache.find(user => user.username == "Anoures");
        user.send(user.username+"\n"+user.Name);
    }
    else if (command === "addmember") {
        newMember = {
            Name: args.shift(),
            Discord: message.author.username
        };
        addMember(newMember); 
        message.reply("Added Member: " + newMember.Name + "," + message.author.username );
    }
    else if (command === "addchore") {
        console.log("attempting to add chore");
        newChore = {
            Name: args.shift(),
            Frequency: args.shift()
        };
        addChore(newChore); 
        message.reply("Added Chore: " + newChore.Name);
    }
    else if (command === "listmembers") {
        listMembers(message);
    }
    else if (command === "listchores") {
        listChores(message);
    }
});                  

console.log("READY");
client.login(config.BOT_TOKEN);