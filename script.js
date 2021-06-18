/* Criando uma função para parar de escrever document.querySelector */
const c = (element) => document.querySelector(element)
const ca = (element) => document.querySelectorAll(element)
// Criando variável para quantidade das pizzas
let modalQT = 1
// Criando variável para o carrinho
let cart = []
// Identificando a pizza selecionada
let modalKey = 0


/*Listando as pizzas*/
pizzaJson.map( (pizza, index) => {

    // Clonando trecho do HTML para inserir as info das pizzas
    let pizzaItem = c('.models .pizza-item').cloneNode(true)

    //Indexando as pizzas
    pizzaItem.setAttribute('data-key', index)

    // Inserindo informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = pizza.img

    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${pizza.price.toFixed(2).replace('.', ',')}`

    pizzaItem.querySelector('.pizza-item--name').innerHTML = pizza.name
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = pizza.description
    
    // Exibindo janela de detalhes da pizza
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault()
        let key = e.target.closest('.pizza-item').getAttribute('data-key')
        //Toda vez que eu abrir o modal vou resetar a quantidade
        modalQT = 1
        modalKey = key
        
        // Colocando as informações da pizza selecionada
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
        c('.pizzaInfo .pizzaInfo--desc').innerHTML = pizzaJson[key].description
        c('.pizzaBig img').src = pizzaJson[key].img
        c('.pizzaInfo--actualPrice').innerHTML = `R$ ${pizzaJson[key].price.toFixed(2). replace('.', ',')}`

        //Sempre deixando a GRANDE marcada (retirando a classe antes de rodar o forEach())
        c('.pizzaInfo--size.selected').classList.remove('selected')


        // Preenchendo os tamanhos
        ca('.pizzaInfo--size').forEach( (size, sizeIndex) => {
            sizeIndex === 2 ? size.classList.add('selected'):''
            
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
        })

        c('.pizzaInfo--qt').innerHTML = modalQT


        c('.pizzaWindowArea').style.opacity = 0
        c('.pizzaWindowArea').style.display = 'flex'
        setTimeout( () => {
            c('.pizzaWindowArea').style.opacity = 1
        }, 30)
    })
    
    // Preenchendo as informações na área adequada
    c('.pizza-area').append( pizzaItem )

})

/*Manipulando o modal*/

// Fechando
const closeModal = () => {
    c('.pizzaWindowArea').style.opacity = 0
    setTimeout ( () => {
        c('.pizzaWindowArea').style.display = 'none'
    }, 500)
}

ca('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach( (item) => {
    item.addEventListener('click', closeModal)
})


// Alterando quantidade
const btnMenos = c('.pizzaInfo--qtmenos')
const btnMais = c('.pizzaInfo--qtmais')
const qtArea = c('.pizzaInfo--qtarea')


btnMais.addEventListener('click', () => {
    modalQT++
    c('.pizzaInfo--qt').innerHTML = modalQT
})

btnMenos.addEventListener('click', () => {
    if(modalQT >1) {modalQT--}
    c('.pizzaInfo--qt').innerHTML = modalQT
})

// Alterando tamanho da pizza
ca('.pizzaInfo--size').forEach( (size, sizeIndex) => {
    size.addEventListener('click', () => {
        c('.pizzaInfo--size.selected').classList.remove('selected')

        size.classList.add('selected')
        
    })
})

// Adicionando ao carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))


    // Criando identificado que concatena o ID com o TAMANHO
    let identifier = pizzaJson[modalKey].id + '@' + size

    let key = cart.findIndex( (item) => {
        return item.identifier === identifier
    }) 

    if (key > -1) {
        cart[key].qt += modalQT
    }
    else{
    //Adicionando
    cart.push({
        identifier: identifier,
        id: pizzaJson[modalKey].id,
        size: size,
        qt: modalQT,
    })
    }

    updateCart()
    closeModal()
})

/*mobile*/
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = 0

    }
})
c('.menu-closer').addEventListener('click', () => {
        c('aside').style.left = '100vw'
})


// Atualizando a área do carrinho (aside)

function updateCart() {
    //mobile
    c('header .menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        c('aside').classList.add('show')
        c('.cart').innerHTML = ''

        let subtotal = 0
        let desconto = 0
        let total = 0

        for (let i in cart) {

            let pizzaItem = pizzaJson.find( (item) => item.id === cart[i].id)
            subtotal += pizzaItem.price * cart[i].qt

            let cartItem = c('.models .cart--item').cloneNode(true)
            let pizzaSizeName 
            
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break
                case 1: 
                    pizzaSizeName = 'M'
                    break
                case 2:
                    pizzaSizeName = 'G'
                    break
            }



            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            cartItem.querySelector('img').src = pizzaItem.img
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++
                updateCart()
            })

            c('.cart').append(cartItem)


        }

        desconto = subtotal * 0.1
        total = subtotal - desconto

        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`


    } else {
        c('aside').classList.remove('show')

        //mobile
        c('aside').style.left = '100vw'
    }
}

