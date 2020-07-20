//описание модели 

const {Schema, model} = require('mongoose')

const userSchema = new Schema({ //поля в БД по юзеру
  email: {
    type: String,
    required: true//обязательно заполнено поле
  },
  name: {
    type: String,
    required: true
  },
  cart: {//корзина
    items: [
      {
        count: {
          type: Number,
          required: true,
          default: 1
        },
        courseId: {
          type: Schema.Types.ObjectId, //тип ObjectId  (строка)
          ref: 'Course',//связываем курс с таблицей курсов  //должно совпадать с course.js (module.exports)
          required: true
        }
      }
    ]
  }
})


userSchema.methods.addToCart = function(course) {  //логика добавления курса в корзину
  const clonedItems = [...this.cart.items]
  const idx = clonedItems.findIndex(c =>{
    return c.courseId.toString() === course._id.toString()
  })

  if(idx >= 0 ){
    clonedItems[idx].count = this.cart.items[idx].count + 1  //увеличиваем count
  } else {
    clonedItems.push({
      courseId: course._id,
      count: 1
    })
  }

  const newCart = {items:clonedItems}

  this.cart = newCart
  return this.save()
}


userSchema.methods.removeFromCart = function(id) {
  let items = [...this.cart.items]
  const idx = items.findIndex( c => {
    return c.courseId.toString() === id.toString()
  })


  if(items[idx].count === 1){ //если курс в корзине в единственном экземпляре
    items = items.filter(c=> c.courseId.toString() !== id.toString())
  }else{          //если курс в корзине >1 экземпляра
    items[idx].count--
  }

  this.cart = {items}
  return this.save()
}


module.exports = model('User', userSchema)