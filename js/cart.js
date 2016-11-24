// Конструктор корзины
class Cart {
	init() {
		this.appendProducts(this.getItemsFromLS("_cart"));
		this.bindEvents();
		this.setTotal(this.countTotal());
		console.log(this.countTotal());
	}

	// Загрузка корзины из localStorage
	getItemsFromLS(key) {
		return JSON.parse(localStorage.getItem(key));
	}

	// Составление HTML кода корзины
	loadProducts(products) {
		return products.reduce((data, item, index) => {
				data += this.createProductTemplate(item, index);
				return data;
		}, "");
	}

	// Создание HTML кода 1 продукта
	createProductTemplate(item, index) {
		return `<div class="cart__item" data-item-id="${item.id}">
							<img class="cart__item-img" src="${item.picture}" alt="cart" width="100" height="66">
							<p class="cart__item-name">${item.name}</p>
							<button class="cart__item-remove">[Remove]</button>
							<p class="cart__item-price">£<span>${item.price}.00</span></p>
							<input type="number" class="cart__items-count" value="${item.count}">
						</div>`
	}

	// Вставка готовой разметки в HTML
	appendProducts(data){
		document.querySelector(".cart__item-list").innerHTML = this.loadProducts(data);
	}

	// Рассчёт цены всех предметов в корзине
	countTotal(cart) {
		cart = cart || this.getItemsFromLS("_cart");
		let price = 0;
		return cart.reduce((price, item) => {
			price += item.price * item.count;
			return price
		}, 0)
	}

	// Установка выводимой цены
	setTotal(total) {
		document.querySelector(".cart__total-price span").innerHTML = total || 0;
	}
	// Возвращает item по его атрибуту data-item-id
	getItemByID(id, items) {
		return items[id];
	}

	bindEvents() {
		document.querySelector(".cart__checkout").onclick = () => false;
		const cartContainer = document.querySelector(".cart__item-list");
		cartContainer.addEventListener("click", event => {
			const target = event.target;
			if (target.classList.contains("cart__item-remove")){
				const id = +target.closest(".cart__item").getAttribute("data-item-id");
				const item = this.getItemByID(id, this.getItemsFromLS("_cart"));
				this.removeItemFromCart(id);
				this.removeItemNode(target);
				this.setTotal(this.countTotal());
			}
		});
		cartContainer.addEventListener("blur", event => {
			const target = event.target;
			if (target.classList.contains("cart__items-count")){
				const value = target.value;
				target.setAttribute("value", value);
				const id = +target.closest(".cart__item").getAttribute("data-item-id");
				this.changeCartItemCount(id, value);
				this.setTotal(this.countTotal());
			}
		}, true);
	}

	// Обновление цены и корзины в localStorage при изменении количества предмета
	changeCartItemCount(id, count) {
		let cart = this.getItemsFromLS('_cart');
		for (var i = 0; i < cart.length; i++) {
			if(id === cart[i].id) {
					cart[i].count = count;
					break;
			}
		}
		this.setItemsToLS("_cart", cart);
	}

	// Удаление из корзины по клику кнопки удаления
	removeItemFromCart(id, cart) {
		cart = cart || this.getItemsFromLS('_cart');
		const findItemIndex = cart.findIndex(data => data.id == id);
		findItemIndex !== -1 && cart.splice(findItemIndex, 1);
		this.setItemsToLS('_cart', cart);
	}

	removeItemNode(triggerNode) {
		triggerNode.closest('.cart__item').remove();
	}

	setItemsToLS(key, items){
		localStorage.setItem(key, JSON.stringify(items));
	}
	
}



document.addEventListener('DOMContentLoaded', () => {
	(new Cart).init();
});
