import { Client, ClientOptions, GatewayIntentBits, Message } from 'discord.js';
import { config } from 'dotenv';
import { PostgreSQL } from './db/PostgreSQL';
import { EMOJIS } from './utils';

config();

const token = process.env.TOKEN;

// const twitch: Twitch = new Twitch('wss://eventsub-beta.wss.twitch.tv/ws');

const postgreSQL = PostgreSQL.getInstance();

const clientParams: ClientOptions = {
    intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
};

const client: Client = new Client(clientParams);

client.on('ready', async () => {
    console.log('BOT ONLINE!!! :D');
    const sessionId = '588363d6-d453-4259-b09c-e8d7906d8e1b';

    try {
        const data = await postgreSQL.getData(`SELECT * FROM "DataSession"`);
        console.log('Post Data', data);

        const insertData = await postgreSQL.addData(
            `INSERT INTO "DataSession"(Id) VALUES($1) ON CONFLICT DO NOTHING`,
            [sessionId]
        );
        console.log('Post insertData', insertData);

        const dataAdded = await postgreSQL.getData(`SELECT * FROM "DataSession"`);
        console.log('Post Data', dataAdded);

    } catch (error) {
        console.error('Error al interactuar con la base de datos:', error);
    }
});


//------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------TWITCH-EVENTS--------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

// twitch.on('error', (data) => console.log('ERROR !!!!!!! ', data));

// twitch.on('connect_failed', (data) => {
//     console.log('Connection Failed ', data);
// });

// twitch.on('unexpected-response', (req) => {
//     console.log('REQ => ', req);
// });

// twitch.on('connect', () => {
//     console.log('Connected to socket server');
// });

// twitch.on('open', () => {
//     //TODO: Conect to events
//     // console.log('CONECTADO!!!!!!!');
// });

// twitch.on('message', (message: WebSocket.Data) => {
//     const buffer = Buffer.from(message as ArrayBuffer);
//     const messageAsString = buffer.toString();
//     const messageAsObject: SocketWelcomeMessage = JSON.parse(messageAsString);
//     if (messageAsObject.metadata.message_type === MessageType.Notificacion) {
//         console.log(
//             '<==================================NOTIFICACION==============================================================> '
//         );
//         //Send message
//         // const channel = client.channels.cache.find(channel => channel.name === 'channelName')
//         const test = client.channels.cache.get(
//             '997976652929835009'
//         ) as TextChannel;
//         const urlTwitch: string = process.env.TWITCH_LINK;
//         test.send(
//             `${EMOJIS.KurtoLink} Tu streamer favorito está en directo! ${EMOJIS.KurtoLove}  Entra a estar un rato de chill ${EMOJIS.PeepoLove} ${urlTwitch}`
//         );
//     } else if (
//         messageAsObject.metadata?.message_type === MessageType.SessionWelcome
//     ) {
//         const sessionId = messageAsObject.payload?.session?.id
//             ? messageAsObject.payload?.session?.id
//             : '';

//         postgreSQL
//             .connect()
//             .then(() => {
//                 postgreSQL.insertData('Session', 'Id', '$1', [sessionId]);
//                 return postgreSQL.selectData(
//                     'Session',
//                     'Id',
//                     'WHERE columna1 = $1',
//                     [sessionId]
//                 );
//             })
//             .catch((err) => console.error('Error en la aplicación', err));
//         // console.log('sessionId => ', sessionId);
//         twitch.subscibeToEvents(sessionId);
//     }
// });

// twitch.on('close', (data) => {
//     console.log('Discconected ', data);
// });
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------

client.on('messageCreate', async (message: Message) => {
    //Do something with the message
    //TODO: Limit chanels to use maybe
    const contentMessage: string = message.content;

    if (message.author.bot) return;

    if (contentMessage.startsWith(`!`)) {
        //If the message it's a command
        switch (contentMessage) {
            case '!twitch':
                const urlTwitch: string = process.env.TWITCH_LINK;
                message.channel.send(
                    `Aqui tienes el link de los directos del panita ${EMOJIS.KurtoLove}  ${EMOJIS.PeepoLove} ${urlTwitch}`
                );

                break;
            default:
                break;
        }
    }
});

client.login(token);
