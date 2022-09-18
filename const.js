const {Markup} = require('telegraf');
const commands = `
/start - Начать взаимодействие с ботом / Start to use bot
/help - Описание возможностей бота / descriptions of functions
/cityname - Поиск по названию города / Search by name of city
/citychoose - Выбор из предложенного списка городов / choose from city-list
/lang - Сменить язык / change a language
`;
const CityListButtons =  Markup.inlineKeyboard(
    [
        [Markup.button.callback('Odessa','Odessa'),
            Markup.button.callback('Vinnytsia','Vinnytsia'),
            Markup.button.callback('Kyiv','Kyiv'),
            Markup.button.callback('Lviv','Lviv'),
            Markup.button.callback('Kharkiv','Kharkiv'),
        ],
        [Markup.button.callback('Dnepr','Dnepr'),
            Markup.button.callback('Mykolaiv','Mykolaiv'),
            Markup.button.callback('Kherson','Kherson'),
        ],
    ]
);
const CityListButtonsRu =  Markup.inlineKeyboard(
    [
        [Markup.button.callback('Одесса','Odessa'),
            Markup.button.callback('Винница','Vinnytsia'),
            Markup.button.callback('Киев','Kyiv'),
            Markup.button.callback('Львов','Lviv'),
            Markup.button.callback('Харьков','Kharkiv'),
        ],
        [Markup.button.callback('Днепр','Dnepr'),
            Markup.button.callback('Николаев','Mykolaiv'),
            Markup.button.callback('Херсон','Kherson'),
        ],
    ]
);
let citylist = ['Odessa','Vinnytsia','Kyiv','Lviv','Kharkiv','Dnepr','Mykolaiv','Kherson'];
let citylistRu = ['Одесса','Винница','Киев','Львов','Харьков','Днепр','Николаев','Херсон'];

module.exports.commands = commands;
module.exports.CityListButtons = CityListButtons;
module.exports.citylist = citylist;
module.exports.CityListButtonsRu = CityListButtonsRu;
module.exports.citylistRu = citylistRu;
