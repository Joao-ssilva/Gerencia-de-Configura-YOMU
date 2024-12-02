function realizarLogin() {
    $('.carregamento').modal('show');

    let usuario = {
        emailInput: document.getElementById('emailInput'),
        senhaInput: document.getElementById('senhaInput')
    };

    firebase
        .auth()
        .signInWithEmailAndPassword(usuario.emailInput.value, usuario.senhaInput.value)
        .then(function (result) {
            window.localStorage.setItem('user', usuario.emailInput.value)
            console.log(result);
            //alert('Autenticado ' + usuario.emailInput.value);
            location.href = 'explorar.html';
        })
        .catch(function (error) {
            if (error.message == 'The password is invalid or the user does not have a password.') {
                $('.msg-escrita').text('A senha é inválida.');
            } else if (error.message == 'There is no user record corresponding to this identifier. The user may have been deleted.') {
                $('.msg-escrita').text('Não há registro de usuário correspondente a esse email.');
            } else if (error.message == 'The email address is badly formatted.') {
                $('.msg-escrita').text('Email inválido.');
            } else {
                $('.msg-escrita').text('Erro desconhecido, tente recarregar a página.');
                console.log('Erro: ' + error.message);
                console.log(error.code);
            }
            setTimeout(function() {
                $('.carregamento').modal('hide');
            }, 2000)

            $('.msg-alerta').show();

        });
}
