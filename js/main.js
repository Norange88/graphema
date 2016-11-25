// Конструктор каталога -----------------------------------------------------------------
class Main {

	init(){
			this.loadData('items.json').then(response => {
				this.setItemsToLS('_products', this.convertItems(response));
				this.appendProducts(response);
			});
		this.bindEvents('.products__item-list');
	}

	// Отсылка XMLHttpRequest
	loadData(url){
		return new Promise((resolve,reject) => {
			const xhr = new XMLHttpRequest;
			xhr.responseType = 'json';
			xhr.open('GET', url, true);
			xhr.onload = () => {
				xhr.status === 200 ? resolve(xhr.response) : reject(xhr);
			};
			xhr.onerror = reject;
			xhr.send();
		});
	}

	convertItems(items){
		return items.map((item, index) => {
			item.id = index;
			return item;
		});
	}

	// Преобразование массива из JSON в HTML код
	loadProducts(products) {
		return products.reduce((data, item, index) => {
				data += this.createProductTemplate(item, index);
				return data;
		}, '');
	}

	// Вставка готовой разметки в HTML
	appendProducts(data){
		document.querySelector('.products__item-list').innerHTML = this.loadProducts(data);
	}

	getItemsFromLS(key){
		return JSON.parse(localStorage.getItem(key));
	}

	setItemsToLS(key, items){
		localStorage.setItem(key, JSON.stringify(items));
	}
	
	// Возвращает item по его атрибуту data-item-id
	getItemByID(id, items) {
		return items[id];
	}

	// Создание HTML кода 1 продукта
	createProductTemplate(item) {
		return `<div class="products__item" data-item-id="${item.id}">
							<img class="products__item-picture" src="${item.picture}" alt="product" width="360" height="240">
							<div class="products__item-content-wrap">
								<p class="products__item-name">${item.name}</p>
								<p class="products__item-color">${item.color}</p>
								<p class="products__item-size">
									<span>Size: ${item.size}</span>
									<a href="#" class="products__item-size-change">[Change]</a>
								</p>
								<footer class="products__item-foooter">
									<p class="products__item-price">£${item.price}.00</p>
									<button class="btn btn--blue">add to basket</button>
								</footer>
							</div>
						</div>`
	}
	
	// Добавление item в корзину по нажатию кнопки add to basket
	bindEvents(){
		const element = document.querySelector('.products__item-list');
		element.addEventListener('click', event => {
			const target = event.target;
			if (target.tagName === "BUTTON") {
				const id = +target.closest(".products__item").getAttribute('data-item-id');
				const item = this.getItemByID(id, this.getItemsFromLS('_products'));
				this.addItemToCart(item);
			}
			return false;
		})
	}
	
	// Создание или обновление корзины в localStorage
	addItemToCart(item) {
		item.count = 1;
		let cart = this.getItemsFromLS('_cart');
		if (cart) {
			const findItem = cart.find(data => data.id === item.id);
			findItem ? findItem.count++ : cart.push(item);
		} else {
			cart = [item];
		}
		this.setItemsToLS('_cart', cart);
	}
}



// Конструктор корзины -----------------------------------------------------------------
class Cart {
	init() {
		this.appendProducts(this.getItemsFromLS("_cart"));
		this.bindEvents(); 
		this.setTotal(this.countTotal());
	}

	// Загрузка корзины из localStorage
	getItemsFromLS(key) {
		return JSON.parse(localStorage.getItem(key));
	}

	// Составление HTML кода корзины
	loadProducts(products) {
		if (products) {
			return products.reduce((data, item, index) => {
				data += this.createProductTemplate(item, index);
				return data;
			}, "");
		}
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
		document.querySelector(".cart__item-list").innerHTML = this.loadProducts(data) || "Your cart is empty";
	}

	// Рассчёт цены всех предметов в корзине
	countTotal(cart) {
		cart = cart || this.getItemsFromLS("_cart") || [];
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
		cart.forEach((item, index) => {
			if(id === item.id) {
				cart[index].count = count;
			}
		});
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


// Добавил Helper, чтобы в App не вызывать дублирующиеся методы -------------------
class Helper {

	setItemsToLS(key, items){
		localStorage.setItem(key, JSON.stringify(items));
	}

	getItemsFromLS(key){
		return JSON.parse(localStorage.getItem(key));
	}


}

// Сборка страницы -----------------------------------------------------------------
class App {

	constructor(root){
		this.cartContoller = new Cart;
		this.mainController = new Main;
		this.helper = new Helper;
		this.root = root;
		this.currentRoute = null;
		this.setRoute(location.hash);
	}
	
	init(){
		window.addEventListener('hashchange', () => {
			this.setRoute(location.hash);
		});
	}

	// Определение, что загружать, каталог или корзину
	setRoute(route) {
		if (route === '#cart' && this.currentRoute !== 'cart'){
			this.renderCart();
			this.currentRoute = 'cart';
		} else if (route === '#main' || route === '' && this.currentRoute !== 'main') {
			this.renderMainPage();
			this.currentRoute = 'main';
		}
	}

	renderMainPage() {
		this.root.innerHTML = this.getMainTemplate();
		this.mainController.loadData('items.json').then(response => {
			this.helper.setItemsToLS('_products', this.mainController.convertItems(response));
			this.mainController.appendProducts(response);
		});
		this.mainController.bindEvents();
	}

	getMainTemplate() {
		return `<section class="products">
							<div class="products__featured-item">
								<img class="products__featured-item-logo" src="img/logo-ray-ban.png" alt="ray-ban" width="190" height="100">
								<p class="products__featured-item-name">
									RB2132 901 NEW WAYFARER
								</p>
								<p class="products__featured-item-description">The Ray-Ban® Wayfarer® is simply the most recognizable style in sunglasses. The distinct shape is paired with the traditional Ray-Ban signature logo on the sculpted temples. After its initial design in 1952, the Ray-Ban Wayfarer quickly endeared itself to Hollywood filmmakers, celebrities, musicians and artists, solidifying its iconic status for years to come.</p>
								<a class="btn btn--green" href="#">find out more</a>
							</div>
							<div class="products__item-list">

							</div>
						</section>`

	}

	renderCart() {
		this.root.innerHTML = this.getCartTemplate();
		this.cartContoller.appendProducts(this.helper.getItemsFromLS("_cart"));
		this.cartContoller.bindEvents();
		this.cartContoller.setTotal(this.cartContoller.countTotal());
	}

	getCartTemplate() {
		return `<section class="cart">
							<p class="cart__headline">Shopping Bag</p>
							<div class="cart__item-list">
								
							</div>
							<footer class="cart__footer">
								<div class="cart__total-price">Total: £<span class="cart__total-price-number"><span></div>
								<a href="#" class="btn btn--orange cart__checkout">Checkout</a>
							</footer>
						</section>`
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const app = new App(document.getElementById('app-root'));
	app.init();
});










