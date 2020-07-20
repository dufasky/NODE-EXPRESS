const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const cardRoutes = require('./routes/card')
const addRoutes = require('./routes/add')
const coursesRoutes = require('./routes/courses')
const User = require ('./models/user')


const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require ('@handlebars/allow-prototype-access') //ставим npm чтобы нормально передавались данные 


const app = express()

const hbs = exphbs.create({ //конфигурация объекта handlebars
    defaultLayout: 'main', //дефолтный шаблон
    extname: 'hbs', //сокращаем название handlebars
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})

//регистрация модуля для рендеринга
app.engine('hbs', hbs.engine) //регистрация движка
app.set('view engine', 'hbs') //1-движок   2-какой используем
app.set('views', 'views') //1-шаблоны  2 - папка с шаблонами

app.use(async (req, res, next)=>{
    try{
    const user = await User.findById('5ef72b2331a86d325ce130ce')
    req.user = user
    next()
    } catch (e) {
        console.log(e);
    }
})


app.use(express.static(path.join(__dirname, 'public'))) //без статики css не будет работать 
app.use(express.urlencoded({
    extended: true
})) //обработка POST
app.use('/', homeRoutes)
app.use('/add', addRoutes)
app.use('/courses', coursesRoutes)
app.use('/card', cardRoutes)


const PORT = process.env.PORT || 3000

async function start() { //подключаемся к БД MONGODB
   try{
    const url = `mongodb+srv://dufa:M06QANHPfopWFKE1@cluster0-fbutu.mongodb.net/shop`  //shop- название БД
    await mongoose.connect(url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })

    const candidate = await User.findOne() //если есть хоть один пользователь, то метод что-нибудь вернет
    if (!candidate) {
        const user = new User({
            email: 'pandavae@ya.ru',
            name: 'Andrew',
            cart: {items: []}
        })

        await user.save()
    }
  
    app.listen(PORT, () => {
        console.log(`Server is running on ${PORT}`);
    })
   }
   catch(e){
       console.log(e)
   }
}

start()



//dufa
//M06QANHPfopWFKE1