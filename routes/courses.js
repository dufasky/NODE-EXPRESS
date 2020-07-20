const {
    Router
} = require('express')
const Course = require('../models/course')
const router = Router()

router.get('/', async (req, res) => {
    const courses = await Course.find()
        .populate('userId', 'email name')
        .select('price title img') 

    console.log(courses);
    


    res.render('courses', {
        title: 'Курсы',
        isCourses: true,
        courses
    })
})

router.get('/:id/edit', async (req, res) => {
    if (!req.query.allow) {
        return res.redirect('/')
    }

    const course = await Course.findById(req.params.id)


    res.render('course-edit', {
        title: `Редактировать ${course.title}`,
        course
    })
})

router.post('/edit', async (req, res) => {
    const {id} = req.body  //хранит req.body.id
    delete req.body.id
    await Course.findByIdAndUpdate(id, req.body)
    res.redirect('/courses')
})

router.post('/remove', async(req, res)=>{  //логика кнопки удаления
    
    try{
        await Course.deleteOne({_id: req.body.id}) //_id в mongoose обозначается id товара
        res.redirect('/courses')
    }catch(e){
        console.log(e);
    }
})

router.get('/:id', async (req, res) => { //обработка id-карточки при нажатии на "просмотреть курс"

    const course = await Course.findById(req.params.id)
    res.render('course', {
        layout: 'empty',
        title: `Курс ${course.title}`,
        course
    })
})

module.exports = router