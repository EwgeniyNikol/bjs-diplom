'use strict';
const userForm = new UserForm();
userForm.loginFormCallback = function(data) {
	ApiConnector.login(data, function(response) {
		// console.log('Ответ сервера:', response);
		if (response.success) {
			location.reload();
		} else {
			userForm.setLoginErrorMessage(response.error);
		}
	});
};

userForm.registerFormCallback = function(data) {
	// console.log('Данные для регистрации:', data);
	ApiConnector.register(data, function(response) {
		// console.log('Ответ сервера при регистрации:', response);
		if (response.success) {
			// console.log('Регистрация успешна! Обновляем страницу...');
			location.reload();
		} else {
			// console.log('Ошибка регистрации:', response.error);
			userForm.setRegisterErrorMessage(response.error);
		}
	});
};