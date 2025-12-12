'use strict';

const logoutButton = new LogoutButton();
logoutButton.action = function(callback) {
	ApiConnector.logout((response) => {
		if (response.success) {
			location.reload();
		}
		// if (callback) {
		// 	callback(response);
		// }
	});
};

ApiConnector.current((response) => {
	if (response.success) {
		ProfileWidget.showProfile(response.data);
	}
});

const ratesBoard = new RatesBoard();

function getCurrencyRates() {
	ApiConnector.getStocks((response) => {
		if (response.success) {
			ratesBoard.clearTable();
			ratesBoard.fillTable(response.data);
		}
	});
}

getCurrencyRates();
setInterval(getCurrencyRates, 60000);

const moneyManager = new MoneyManager();

moneyManager.sendMoneyCallback = function(data) {
	// if (!data.to || String(data.to).trim() === '') {
	// 	moneyManager.setMessage('Выберите получателя из списка', false);
	// 	return;
	// }

	// if (!data.currency) {
	// 	moneyManager.setMessage('Выберите валюту', false);
	// 	return;
	// }

	// const recipient = Number(data.to);
	// const amount = parseFloat(Number(data.amount).toFixed(2));

	// if (isNaN(recipient) || recipient <= 0) {
	// 	moneyManager.setMessage('Некорректный получатель', false);
	// 	return;
	// }

	// if (isNaN(amount) || amount <= 0) {
	// 	moneyManager.setMessage('Введите корректную сумму перевода', false);
	// 	return;
	// }

	moneyManager.setMessage('Выполняется перевод...', null);

	ApiConnector.transferMoney({
		to: recipient,
		amount: amount,
		currency: String(data.currency).trim()
	}, function(response) {
		if (!response) {
			moneyManager.setMessage('Нет ответа от сервера', false);
			return;
		}

		if (response.success && response.data) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage('Перевод выполнен!', true);
		} else {
			const errorMessage = response.error || 'Ошибка при выполнении перевода';
			moneyManager.setMessage(errorMessage, false);
		}
	});
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
	if (response.success) {
		favoritesWidget.clearTable();
		favoritesWidget.fillTable(response.data);
		favoritesWidget.updateUsersList(response.data);
	}
});

favoritesWidget.addUserCallback = function(data) {
	ApiConnector.addUserToFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			favoritesWidget.updateUsersList(response.data);
			favoritesWidget.setMessage('Пользователь добавлен в избранное', true);
		} else {
			favoritesWidget.setMessage(response.error || 'Ошибка при добавлении', false);
		}
	});
};

favoritesWidget.removeUserCallback = function(data) {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			favoritesWidget.updateUsersList(response.data);
			favoritesWidget.setMessage('Пользователь удален из избранного', true);
		} else {
			favoritesWidget.setMessage(response.error || 'Ошибка при удалении', false);
		}
	});
};