const { Telegraf,Markup,Composer} = require('telegraf');
require('dotenv').config();

const bot = new Telegraf('5177502021:AAHVFoTp2iQbwyFVu3ODg2EdUkf-eVAC-qo');

var XMLHttpRequest = require('xhr2');

const {commands,CityListButtons,citylist,citylistRu,CityListButtonsRu} = require('./const');

const param = {
    "url" : "https://api.openweathermap.org/data/2.5/",
    "appid" : "498bea40fe54ae7f516ecbbab0779da8"
}

let lang = 'ru';

async function getWeather(requestData,ctx) {
    const url = `${param.url}weather?q=${requestData}&units=metric&lang=${encodeURIComponent(lang)}&APPID=${param.appid}`;
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", function() {
        if(xhr.status != 404){
            return showWeather(JSON.parse(xhr.responseText),ctx);
        }
        if(xhr.status === 404 && requestData != '/cityname'){
            ctx.reply('Такого города не существует. Пожалуйста проверьте правильность написания города.')
        }
    }, false);
    await  xhr.open('GET', url);
    await  xhr.send();
}

const showWeather = async (data,ctx) => {
    let normilizeData = '';
    let time = new Date();
    if(lang === 'ru'){
        normilizeData = `
Погода в городе ${data['name']} ${(data['weather'][0]['main']).toLocaleLowerCase().indexOf('cloud') > 0 ? '☀' : '☁' } ${time.getDate()}.0${time.getMonth()+1}.${time.getFullYear()}
Температура = 🌡 ${data['main']['temp']}
Влажность = ${data['main']['humidity']}
Давление = ${data['main']['pressure']}
Погода =  ${data['weather']['0']['main']}
Детали =  ${data['weather']['0'].description}
Cкорость ветра =  🌬 ${data['wind']['speed']}
`;
    }

    if(lang === 'en'){
        normilizeData = `
Weather in ${data['name']} ${(data['weather'][0]['main']).toLocaleLowerCase().indexOf('cloud') > 0 ? '☀' : '☁' } ${time.getMonth()+1}.${time.getDate()}.${time.getFullYear()}
Temperature = 🌡 ${data['main']['temp']} 
Humidity = ${data['main']['humidity']}
Pressure = ${data['main']['pressure']}
Weather =  ${data['weather']['0']['main']}
Details =  ${data['weather']['0'].description}
Wind speed =  🌬 ${data['wind']['speed']}
`;
    }
    const answer = ()=>{
        ctx.reply(normilizeData)
        // if(JSON.stringify(data['weather'][0]['main']).toLocaleLowerCase().indexOf('cloud') === 1){
        //     ctx.replyWithPhoto('https://tlgrm.ru/_/stickers/9d4/44b/9d444bb6-d895-3ddc-9d38-44981f03bc65/30.jpg')
        // }
        // if(JSON.stringify(data['weather'][0]['main']).toLocaleLowerCase().indexOf('clear') === 1){
        //     ctx.replyWithPhoto('https://tlgrm.ru/_/stickers/9d4/44b/9d444bb6-d895-3ddc-9d38-44981f03bc65/192/24.jpg')
        // }
    }
    return answer();
}

bot.start(async (ctx) => {
    await  ctx.reply(
        'Добрый день. \nЯ бот-синоптик, помогу узнать тебе погоду\n' +
        'Good day. I`m bot-forecaster i will help you to know weather\n',
    );
    await ctx.reply(commands);
    Markup.inlineKeyboard(
        [
            [Markup.button.callback('RU','RU',),
                Markup.button.callback('EN','EN'),
            ],
        ]
    )
});


bot.help((ctx) => ctx.reply(commands));

bot.command('cityname',async(ctx)=>{
    await ctx.telegram.sendMessage(ctx.message.chat.id, `Напишите название города:`)
})

bot.command('citychoose',async (ctx)=>{
    try{
        let text = '';
        if(lang === 'ru'){
            text = 'Список городов';
            await ctx.replyWithHTML(`<b>${text}</b>`, CityListButtonsRu)
        }
        if(lang === 'en'){
            text = 'City list';
            await ctx.replyWithHTML(`<b>${text}</b>`, CityListButtons)
        }

    }catch (e) {
        console.error(e)
    }
})


bot.command('lang',async(ctx)=>{
    let text = '';
    if(lang === 'ru'){
        text = 'Выбор языка';
        await ctx.reply('Текущий язык - русский');
    }
    if(lang === 'en'){
        text = 'Choose a language';
        await ctx.reply('Current language - English');
    }
    await ctx.replyWithHTML(`<b>${text}</b>`,
        Markup.inlineKeyboard(
            [
                [Markup.button.callback('RU','RU',),
                    Markup.button.callback('EN','EN'),
                ],
            ]
        )
    );
})

bot.action('RU',async (ctx)=>{
    try{
        await ctx.answerCbQuery()
        lang = 'ru';
        await ctx.reply('Выбран новый язык - русский');

    }catch(e){
        console.log(e)
    }
});
bot.action(`EN`,async (ctx)=>{
    try{
        await ctx.answerCbQuery()
        lang = 'en';
        await ctx.reply('You have chosen English');

    }catch(e){
        console.log(e)
    }
});

citylistRu.forEach(function (element) {
    bot.action(`${element}`,async (ctx)=>{
        try{
            await ctx.answerCbQuery()
            getWeather(`${element}`,ctx);

        }catch(e){
            console.log(e)
        }
    });
})

citylist.forEach(function (element) {
    bot.action(`${element}`,async (ctx)=>{
        try{
            await ctx.answerCbQuery()
            getWeather(`${element}`,ctx);

        }catch(e){
            console.log(e)
        }
    });
})

bot.on('text', async(ctx) => {
    await getWeather(encodeURIComponent(ctx.message.text), ctx);
})



bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


