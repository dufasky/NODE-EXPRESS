const {Router} = require('express')
const Course = require('../models/course') //подключаем модель курс
const router = Router()

router.get ('/',(req,res) => {
    res.render('add', {
        title: 'Добавить курс',
        isAdd: true
        
    })
})

router.post('/', async (req, res)=>{    //обработка POST

    const course = new Course({
        title: req.body.title,
        price: req.body.price,
        img: req.body.imgб,
        userId: req.user._id  //id пользователя который создал курс
    })

    try{
        await course.save()
        res.redirect('/courses')      //после добавления курса перенаправляем пользователя на все курсы
    }
    catch(e){
        console.log(e)
    }
})

module.exports = router