const {Router} = require('express')
const Course = require('../models/course')
const router = Router()


function mapCartItems(cart){
  return cart.items.map (c => ({
    ...c.courseId._doc, 
    id: c.courseId.id,
    count: c.count
  }))
}


function computePrice(courses){   //функция высчитывающая цену
  return courses.reduce((total, course)=>{
      return total += course.price * course.count
  }, 0)
}



router.post('/add', async (req, res) => {
  const course = await Course.findById(req.body.id)
  await req.user.addToCart(course)
  res.redirect('/card')
})

router.delete('/remove/:id', async (req, res)=>{ //метод удаления из карзины
  await req.user.removeFromCart(req.params.id)  //берем id из адресной строки /remove/:id
  const user = await req.user.populate('cart.items.courseId').execPopulate()


  const courses = mapCartItems(user.cart)
  const cart = {
    courses, price: computePrice(courses)
  }


  res.status(200).json(card) 
})

router.get('/', async (req, res) => {
  const user = await req.user
    .populate('cart.items.courseId')
    .execPopulate()  

  const courses = mapCartItems(user.cart)

    res.render('card', {
      title: 'Корзина',
      isCard: true,
      courses: courses,
      price: computePrice(courses)
    })

})

module.exports = router