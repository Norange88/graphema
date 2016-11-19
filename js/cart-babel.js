"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Конструктор корзины
var Cart = function () {
	function Cart() {
		_classCallCheck(this, Cart);
	}

	_createClass(Cart, [{
		key: "init",
		value: function init() {
			this.appendProducts(this.getItemsFromLS("_cart"));
			this.bindEvents();
			this.setTotal(this.countTotal());
			console.log(this.countTotal());
		}

		// Загрузка корзины из localStorage

	}, {
		key: "getItemsFromLS",
		value: function getItemsFromLS(key) {
			return JSON.parse(localStorage.getItem(key));
		}

		// Составление HTML кода корзины

	}, {
		key: "loadProducts",
		value: function loadProducts(products) {
			var _this = this;

			return products.reduce(function (data, item, index) {
				data += _this.createProductTemplate(item, index);
				return data;
			}, "");
		}

		// Создание HTML кода 1 продукта

	}, {
		key: "createProductTemplate",
		value: function createProductTemplate(item, index) {
			return "<div class=\"cart__item\" data-item-id=\"" + item.id + "\">\n\t\t\t\t\t\t\t<img class=\"cart__item-img\" src=\"" + item.picture + "\" alt=\"cart\" width=\"100\" height=\"66\">\n\t\t\t\t\t\t\t<p class=\"cart__item-name\">" + item.name + "</p>\n\t\t\t\t\t\t\t<button class=\"cart__item-remove\">[Remove]</button>\n\t\t\t\t\t\t\t<p class=\"cart__item-price\">\xA3<span>" + item.price + ".00</span></p>\n\t\t\t\t\t\t\t<input type=\"number\" class=\"cart__items-count\" value=\"" + item.count + "\">\n\t\t\t\t\t\t</div>";
		}

		// Вставка готовой разметки в HTML

	}, {
		key: "appendProducts",
		value: function appendProducts(data) {
			document.querySelector(".cart__item-list").innerHTML = this.loadProducts(data);
		}

		// Рассчёт цены всех предметов в корзине

	}, {
		key: "countTotal",
		value: function countTotal(cart) {
			cart = cart || this.getItemsFromLS("_cart");
			var price = 0;
			return cart.reduce(function (price, item) {
				price += item.price * item.count;
				return price;
			}, 0);
		}

		// Установка выводимой цены

	}, {
		key: "setTotal",
		value: function setTotal(total) {
			document.querySelector(".cart__total-price span").innerHTML = total || 0;
		}
		// Возвращает item по его атрибуту data-item-id

	}, {
		key: "getItemByID",
		value: function getItemByID(id, items) {
			return items[id];
		}
	}, {
		key: "bindEvents",
		value: function bindEvents() {
			var _this2 = this;

			document.querySelector(".cart__checkout").onclick = function () {
				return false;
			};
			var cartContainer = document.querySelector(".cart__item-list");
			cartContainer.addEventListener("click", function (event) {
				var target = event.target;
				if (target.classList.contains("cart__item-remove")) {
					var id = +target.closest(".cart__item").getAttribute("data-item-id");
					var item = _this2.getItemByID(id, _this2.getItemsFromLS("_cart"));
					_this2.removeItemFromCart(id);
					_this2.removeItemNode(target);
					_this2.setTotal(_this2.countTotal());
				}
			});
			cartContainer.addEventListener("blur", function (event) {
				var target = event.target;
				if (target.classList.contains("cart__items-count")) {
					var value = target.value;
					target.setAttribute("value", value);
					var id = +target.closest(".cart__item").getAttribute("data-item-id");
					_this2.changeCartItemCount(id, value);
					_this2.setTotal(_this2.countTotal());
				}
			}, true);
		}

		// Обновление цены и корзины в localStorage при изменении количества предмета

	}, {
		key: "changeCartItemCount",
		value: function changeCartItemCount(id, count) {
			var cart = this.getItemsFromLS('_cart');
			for (var i = 0; i < cart.length; i++) {
				if (id === cart[i].id) {
					cart[i].count = count;
					break;
				}
			}
			this.setItemsToLS("_cart", cart);
		}

		// Удаление из корзины по клику кнопки удаления

	}, {
		key: "removeItemFromCart",
		value: function removeItemFromCart(id, cart) {
			cart = cart || this.getItemsFromLS('_cart');
			var findItemIndex = cart.findIndex(function (data) {
				return data.id == id;
			});
			findItemIndex !== -1 && cart.splice(findItemIndex, 1);
			this.setItemsToLS('_cart', cart);
		}
	}, {
		key: "removeItemNode",
		value: function removeItemNode(triggerNode) {
			triggerNode.closest('.cart__item').remove();
		}
	}, {
		key: "setItemsToLS",
		value: function setItemsToLS(key, items) {
			localStorage.setItem(key, JSON.stringify(items));
		}
	}]);

	return Cart;
}();

// // Функционал корзины
// function cart() {
// 	var cart_total = 0;
// 	var items;

// 	// Рассчёт цены всех предметов в корзине
// 	function count_total(items) {
// 		items = document.querySelectorAll(".cart__item");
// 		var old_total = cart_total;
// 		cart_total = 0;
// 		for(var i = 0; i<items.length; i++) {
// 			var price = items[i].querySelector(".cart__item-price span").textContent;
// 			var quantity = items[i].querySelector(".cart__items-count").value;
// 			var item_total = price*quantity;
// 			cart_total += item_total;
// 		};
// 	}

// 	// Установка выводимой цены
// 	function set_total(total) {
// 		document.querySelector(".cart__total-price span").textContent = total;
// 	}

// 	// Перерасчёт выводимой цены
// 	function recount_cart() {
// 		count_total(items);
// 		set_total(cart_total);
// 	}
// 	recount_cart();

// 	// Перерасчёт выводимой цены при изменении полей количества
// 	var quantity_fields = document.querySelectorAll(".cart__items-count");
// 	for (var i=0; i<quantity_fields.length; i++) {
// 		quantity_fields[i].addEventListener("blur", recount_cart)
// 	}

// 	// Удаление из корзины по клику кнопки удаления
// 	function remove_item() {
// 		var item = this.closest(".cart__item");
// 		item.remove();
// 		recount_cart();
// 	}

// 	var remove_btns = document.querySelectorAll(".cart__item-remove");
// 	for (var i=0; i<remove_btns.length; i++) {
// 		remove_btns[i].addEventListener("click", remove_item);
// 	}
// };

document.addEventListener('DOMContentLoaded', function () {
	new Cart().init();
});
//# sourceMappingURL=cart-babel.js.map
