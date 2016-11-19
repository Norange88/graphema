'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
	function App() {
		_classCallCheck(this, App);
	}

	_createClass(App, [{
		key: 'init',
		value: function init() {
			var _this = this;

			this.loadData('items.json').then(function (response) {
				_this.setItemsToLS('_products', _this.convertItems(response));
				_this.appendProducts(response);
			});
			this.bindEvents('.products__item-list');
		}

		// Отсылка XMLHttpRequest

	}, {
		key: 'loadData',
		value: function loadData(url) {
			return new Promise(function (resolve, reject) {
				var xhr = new XMLHttpRequest();
				xhr.responseType = 'json';
				xhr.open('GET', url, true);
				xhr.onload = function () {
					xhr.status === 200 ? resolve(xhr.response) : reject(xhr);
				};
				xhr.onerror = reject;
				xhr.send();
			});
		}
	}, {
		key: 'convertItems',
		value: function convertItems(items) {
			return items.map(function (item, index) {
				item.id = index;
				return item;
			});
		}

		// Преобразование массива из JSON в HTML код

	}, {
		key: 'loadProducts',
		value: function loadProducts(products) {
			var _this2 = this;

			return products.reduce(function (data, item, index) {
				data += _this2.createProductTemplate(item, index);
				return data;
			}, '');
		}

		// Вставка готовой разметки в HTML

	}, {
		key: 'appendProducts',
		value: function appendProducts(data) {
			document.querySelector('.products__item-list').innerHTML = this.loadProducts(data);
		}
	}, {
		key: 'getItemsFromLS',
		value: function getItemsFromLS(key) {
			return JSON.parse(localStorage.getItem(key));
		}
	}, {
		key: 'setItemsToLS',
		value: function setItemsToLS(key, items) {
			localStorage.setItem(key, JSON.stringify(items));
		}

		// Возвращает item по его атрибуту data-item-id

	}, {
		key: 'getItemByID',
		value: function getItemByID(id, items) {
			return items[id];
		}

		// Создание HTML кода 1 продукта

	}, {
		key: 'createProductTemplate',
		value: function createProductTemplate(item) {
			return '<div class="products__item" data-item-id="' + item.id + '">\n\t\t\t\t<img class="products__item-picture" src="' + item.picture + '" alt="product" width="360" height="240">\n\t\t\t\t<div class="products__item-content-wrap">\n\t\t\t\t\t<p class="products__item-name">' + item.name + '</p>\n\t\t\t\t\t<p class="products__item-color">' + item.color + '</p>\n\t\t\t\t\t<p class="products__item-size">\n\t\t\t\t\t\t<span>Size: ' + item.size + '</span>\n\t\t\t\t\t\t<a href="#" class="products__item-size-change">[Change]</a>\n\t\t\t\t\t</p>\n\t\t\t\t\t<footer class="products__item-foooter">\n\t\t\t\t\t\t<p class="products__item-price">\xA3' + item.price + '.00</p>\n\t\t\t\t\t\t<button class="btn btn--blue">add to basket</button>\n\t\t\t\t\t</footer>\n\t\t\t\t</div>\n\t\t\t</div>';
		}

		// Добавление item в корзину по нажатию кнопки add to basket

	}, {
		key: 'bindEvents',
		value: function bindEvents(selector) {
			var _this3 = this;

			var element = document.querySelector(selector);
			element.addEventListener('click', function (event) {
				var target = event.target;
				if (target.tagName === "BUTTON") {
					var id = +target.closest(".products__item").getAttribute('data-item-id');
					var item = _this3.getItemByID(id, _this3.getItemsFromLS('_products'));
					_this3.addItemToCart(item);
				}
				return false;
			});
		}

		// Создание или обновление корзины в localStorage

	}, {
		key: 'addItemToCart',
		value: function addItemToCart(item) {
			item.count = 1;
			var cart = this.getItemsFromLS('_cart');
			if (cart) {
				var findItem = cart.find(function (data) {
					return data.id === item.id;
				});
				findItem ? findItem.count++ : cart.push(item);
			} else {
				cart = [item];
			}
			this.setItemsToLS('_cart', cart);
		}
	}]);

	return App;
}();

document.addEventListener('DOMContentLoaded', function () {
	new App().init();
});
//# sourceMappingURL=main-babel.js.map
