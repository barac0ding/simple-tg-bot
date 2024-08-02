const TelegramApi = require('node-telegram-bot-api')
const token = "6708259781:AAG87vZyX6tcsUs7yWGv1JEXa2scHMPLuU0";
const {gameOptions, againOptions} = require('./options.js')

const bot = new TelegramApi(token, { polling: true })


function start() {
    const chats = {}
    

    const startGame = async (chatID) => {
        await bot.sendMessage(chatID, 'Bot choose number from 0 to 9. You need to guess the number')
        const randomNumber = Math.floor(Math.random() * 10)
        chats[chatID] = randomNumber
        await bot.sendMessage(chatID, "Try to guess", gameOptions)
    }

    bot.setMyCommands(
        [
            { command: '/start', description: 'start bot' },
            { command: '/info', description: 'info about you' },
            { command: '/game', description: 'game \"guess the number\"' }
        ]
    )



    bot.on("message", async msg => {
        const text = msg.text
        const chatID = msg.chat.id
        if (text == '/start') {
            await bot.sendSticker(chatID, 'https://tlgrm.eu/_/stickers/11d/46f/11d46fe5-3fa2-4c4e-a912-aa8c917b468f/3.webp')
            return bot.sendMessage(chatID, "Hello to my bot")
        }
        if (text == '/info') {
            return bot.sendMessage(chatID, `Your name is ${msg.from.first_name}`)
        }

        if (text === "/game") {
            return startGame(chatID)
        }

        return bot.sendMessage(chatID, "I don't understand you")
    })

    bot.on('callback_query', async msg => {
        const data = msg.data
        const chatID = msg.message.chat.id

        if (data === '/again') {
            startGame(chatID)
        }
        if (data == chats[chatID]) {
            return await bot.sendMessage(chatID, `Congrats! You guess the number: ${chats[chatID]}`, againOptions)
        } else {
            return await bot.sendMessage(chatID, `Sorry! You don't guess the number: ${chats[chatID]}`, againOptions)
        }
    })

}

start()