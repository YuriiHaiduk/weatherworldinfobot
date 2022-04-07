const telegramApi = require('node-telegram-bot-api');

const {gameOptions,againOptions} = require('./options');

const token = '5109459251:AAHATt1dduhRNhEq7v5wwtnXq456D9awwyE';

const bot = new telegramApi(token,{polling:true})

const chats = {};



const startGame = async (chatId) => {
    await bot.sendMessage(chatId,'i will choose number from 0 to 9, you should to guess him');
    function getRandomInt(max) {
        return Math.floor(Math.random() * (max));
    }
    const randomNumber = getRandomInt(6);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId,'guess it!', gameOptions)
}



const start = () => {
    bot.setMyCommands([
        {command:'/start', description: 'Начальное приветствие'},
        {command:'/info', description: 'Описание'},
        {command:'/game', description: 'guess a number'},
    ])

    bot.on('message',async msg =>{
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start'){
            await bot.sendSticker(chatId,'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/1.webp');
            return   bot.sendMessage(chatId, 'Добро пожаловать ты написал телеграм боту Тьюринга - короля мемов', {
                parse_mode: 'Markdown',
            });
        }
        if(text == '/info'){
            return bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name}`);
        }

        if(text == '/game'){
            startGame(chatId);
        }

        return bot.sendMessage(chatId,'Не могу распознать команды, попробуй ещё раз')

    });

    bot.on('callback_query' ,async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if(data === '/again'){
           return  startGame(chatId);
        }
        if(data == chats[chatId]){
            return  bot.sendMessage(chatId,`congratulations you are guessed a number - ${data}` , againOptions )
        }
        else{
            return bot.sendMessage(chatId,`unfortunatly you are'nt guessed, number was a - ${chats[chatId]}`, againOptions )
        }
        bot.sendMessage(chatId,`You choose number ${data}`)

    })
}

start();