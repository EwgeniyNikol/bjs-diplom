'use strict';
const logoutButton = new LogoutButton();

logoutButton.action = function(callback) {
    ApiConnector.logout((response) => {
        if (response.success) {
            location.reload();
        }
        
        if (callback) {
            callback(response);
        }
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

moneyManager.addMoneyCallback = function(data) {
	ApiConnector.addMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, 'Баланс успешно пополнен');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
};

moneyManager.conversionMoneyCallback = function(data) {
	ApiConnector.convertMoney(data, (response) => {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage(true, 'Конвертация выполнена успешно');
		} else {
			moneyManager.setMessage(false, response.error);
		}
	});
};

moneyManager.sendMoneyCallback = function(data) {
	console.log('Данные перевода:', data);

	if (!data.to) {
		moneyManager.setMessage('Выберите получателя из списка', false);
		return;
	}

	ApiConnector.transferMoney({
		to: Number(data.to),
		amount: Number(data.amount),
		currency: data.currency
	}, function(response) {
		if (response.success) {
			ProfileWidget.showProfile(response.data);
			moneyManager.setMessage('Перевод выполнен!', true);
		} else {
			moneyManager.setMessage('Ошибка: ' + response.error, false);
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
			favoritesWidget.setMessage(true, 'Пользователь добавлен в избранное');
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
};

favoritesWidget.removeUserCallback = function(data) {
	ApiConnector.removeUserFromFavorites(data, (response) => {
		if (response.success) {
			favoritesWidget.clearTable();
			favoritesWidget.fillTable(response.data);
			favoritesWidget.updateUsersList(response.data);
			favoritesWidget.setMessage(true, 'Пользователь удален из избранного');
		} else {
			favoritesWidget.setMessage(false, response.error);
		}
	});
};