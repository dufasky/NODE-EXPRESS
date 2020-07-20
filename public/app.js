/*оформление цен на странице с курсами*/

const toCurrency = price => {   //оформление цены
    return new Intl.NumberFormat('ru-RU', {
      currency: 'rub',
      style: 'currency'
    }).format(price)
  }
  
  document.querySelectorAll('.price').forEach(node => {
    node.textContent = toCurrency(node.textContent)
  })
  
  const $card = document.querySelector('#card')//удаление из корзины
  if ($card) {
    $card.addEventListener('click', event => {
      if (event.target.classList.contains('js-remove')) {
        const id = event.target.dataset.id
        
        fetch('/card/remove/' + id, {
          method: 'delete' //специальный метод феча (прописан в card.js routes)
        }).then(res => res.json())
          .then(card => {
            if (card.courses.length) {
              const html = card.courses.map(c => { //js-remove - класс кнопки удалить который будем обрабатывать
                return `
                <tr>
                  <td>${c.title}</td>
                  <td>${c.count}</td>
                  <td>
                    <button class="btn btm-small js-remove" data-id="${c.id}">Удалить</button>
                  </td>
                </tr>
                `
              }).join('')
              $card.querySelector('tbody').innerHTML = html
              $card.querySelector('.price').textContent = toCurrency(card.price)
            } else {
              $card.innerHTML = '<p>Корзина пуста</p>'
            }
          })
      }
    })
  } 