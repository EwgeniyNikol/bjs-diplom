'use strict';
const logoutButton = new LogoutButton();
logoutButton.action = function() {
    ApiConnector.logout(function(response) {
        if (response.success) {
            location.reload();
        }
    });
};

ApiConnector.current(function(response) {
    if (response.success) {
        ProfileWidget.showProfile(response.data);
    }
});

const ratesBoard = new RatesBoard();
function getCurrencyRates() {
    ApiConnector.getStocks(function(response) {
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
    ApiConnector.addMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage('Баланс пополнен!', true);
        } else {
            moneyManager.setMessage('Ошибка: ' + response.error, false);
        }
    });
};

moneyManager.conversionMoneyCallback = function(data) {
    ApiConnector.convertMoney(data, function(response) {
        if (response.success) {
            ProfileWidget.showProfile(response.data);
            moneyManager.setMessage('Конвертация успешна!', true);
        } else {
            moneyManager.setMessage('Ошибка: ' + response.error, false);
        }
    });
};

function fillTransferSelectOnly(usersData) {
    setTimeout(() => {
        const allSelects = document.querySelectorAll('select');
        if (allSelects.length >= 4) {
            const select = allSelects[3];
            
            
            if (select.options.length <= 1) {
                
                const users = Object.entries(usersData).map(([id, name]) => ({
                    id: parseInt(id),
                    name: name
                }));
                
                
                const placeholder = select.querySelector('option[value=""]');
                
                
                select.innerHTML = '';
                
                
                if (placeholder) {
                    select.appendChild(placeholder);
                } else {
                    const newPlaceholder = document.createElement('option');
                    newPlaceholder.value = '';
                    newPlaceholder.textContent = 'Выберите пользователя';
                    newPlaceholder.disabled = true;
                    newPlaceholder.selected = true;
                    select.appendChild(newPlaceholder);
                }
                
               
                users.forEach(user => {
                    const option = document.createElement('option');
                    option.value = user.id;
                    option.textContent = user.name;
                    select.appendChild(option);
                });
                
                console.log('Select заполнен:', users.length, 'пользователей');
            }
        }
    }, 1000);
}


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


ApiConnector.getFavorites(function(response) {
    if (response.success && response.data) {
        
        favoritesWidget.clearTable();
        favoritesWidget.fillTable(response.data);
        
        
        fillTransferSelectOnly(response.data);
    }
});


favoritesWidget.addUserCallback = function(data) {
    ApiConnector.addUserToFavorites(data, function(response) {
        if (response.success && response.data) {
            
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.setMessage('Добавлено в избранное!', true);
            
            
            fillTransferSelectOnly(response.data);
        } else {
            favoritesWidget.setMessage('Ошибка: ' + response.error, false);
        }
    });
};


favoritesWidget.removeUserCallback = function(data) {
    ApiConnector.removeUserFromFavorites(data, function(response) {
        if (response.success && response.data) {
            
            favoritesWidget.clearTable();
            favoritesWidget.fillTable(response.data);
            favoritesWidget.setMessage('Удалено из избранного!', true);
            
            
            fillTransferSelectOnly(response.data);
        } else {
            favoritesWidget.setMessage('Ошибка: ' + response.error, false);
        }
    });
};