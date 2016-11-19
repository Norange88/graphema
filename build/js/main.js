
class App{

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
	bindEvents(selector){
		const element = document.querySelector(selector);
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

document.addEventListener('DOMContentLoaded', () => {
	(new App).init();
});

