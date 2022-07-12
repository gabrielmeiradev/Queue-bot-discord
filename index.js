const Discord = require('discord.js');

const bot = new Discord.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"]
})
const token = '[token]';
bot.login(token)
bot.on('ready', () => {
    console.log('Ready!')
})

let maps = []

function startTimer(index_mapa, pos_fila) {
    setInterval(() => {
        maps[index_mapa].registered[pos_fila].usertime--;
    }, 1000)
}

setInterval(checkTimers, 1000);

function checkTimers() {
    maps.forEach((map, i) => {
        map.registered.forEach((registro, e) => {
            if (registro.usertime <= 0) {
                pos--;
                bot.users.fetch(registro.userId.toString()).then(dm => {
                    dm.send('**Seu tempo acabou.**')
                })
                registro.usertime = undefined;
            }
        })
    })
}

let pos = 0;

function register(mapName, user, time) {
    maps.forEach((map, index) => {
        if (map.name.toLowerCase() == mapName.toLowerCase()) {
            map.registered.push({
                userId: user.id,
                usertime: time
            });
            startTimer(index, map.registered.length - 1);
            pos++;
            user.send(`Você se registrou em ***${map.name}*** por: ***${map.registered[map.registered.length-1].usertime} segundos***`);
            user.send('Sua posição nesse mapa é: ' + pos);
        }
    })
}

const prefix = '!map';

bot.on('messageCreate', msg => {
    if (msg.content.includes(prefix + ' ')) {
        let map = msg.content.split(' ')[1];
        let posfix = msg.content.split(' ')[2];

        msg.react('✅');

        switch (map) {
            case 'clear':
                maps.forEach((map) => {
                    map.registered = [];
                })
                msg.reply('__Fila limpa com sucesso!__')
                break;
            case 'add':
                maps.push({
                    name: posfix,
                    registered: []
                })
                msg.reply('Mapa: **' + posfix + '** registrado com sucesso!')
                break;
            case 'about':
                const { MessageEmbed } = require('discord.js');

                const Welcome = new MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Obrigado por me adicionar')
                    .setURL('https://discord.js.org/')
                    .setAuthor({
                        name: 'Queue Bot',
                        iconURL: 'https://cdn.discordapp.com/attachments/987449087936835655/996480123966599278/loguinho.png',
                        url: 'https://discord.js.org'
                    })
                    .setDescription('Originalmente criado para jogadores de tibia 🎷')
                    .setThumbnail('https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjRtxcj5_ucov5GTL2W2xh93Vfc0Dbnjl0uF445gIMt5W_f_BX6jPfiaTXi_W_cjbdc7p2y7yGjkVFcWLA1xsn_A0ucrktGGiMqv_xj9Nsi8U0vfk9q5fFkDszcjMNIdZochEFkBQpJ65ABMWsmj_upXii6olbBaELQfSoByEgpOjV5pIh40jKfv6x1fg/w640-h470/crystal%20column_TibiaHome_Contest_Norelli.png')
                    .addFields({
                        name: 'Descrição',
                        value: 'Esse bot serve para os usuários do server poderem cadastrar mapas e se cadastrarem a filas com um determinado tempo de sessão. A cada sessão que acaba a próxima começa.'
                    }, {
                        name: '\u200B',
                        value: '\u200B'
                    }, {
                        name: 'Criador',
                        value: 'Gabriel Meira',
                        inline: true
                    }, {
                        name: 'Data de criação',
                        value: '11/07/2022',
                        inline: true
                    }, )
                    .addField('Última alteração', '12/07/2022 15:18', true)
                    .setImage('https://cdn.discordapp.com/attachments/987449087936835655/996480123966599278/loguinho.png')
                    .setTimestamp()
                    .setFooter({
                        text: '🙂',
                        iconURL: 'https://cdn.discordapp.com/attachments/987449087936835655/996480123966599278/loguinho.png'
                    });
                msg.reply({
                    embeds: [Welcome]
                });

            default:
                register(map, msg.author, posfix)
        }
    }
})