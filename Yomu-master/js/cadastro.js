function realizarCadastro() {
    $('.carregamento').modal('show');

    let usuario = {
        nomeInput: document.getElementById('nomeInput'),
        nickInput: document.getElementById('nickInput'),
        emailInput: document.getElementById('emailInput'),
        senhaInput: document.getElementById('senhaInput')
    };

    firebase
        .auth()
        .createUserWithEmailAndPassword(usuario.emailInput.value, usuario.senhaInput.value)
        .then(function () {
            criarUsuarioRTDB(usuario.emailInput.value, usuario.nickInput.value);

            /*TODO: virar um modal alert('Bem vindo ' + usuario.emailInput.value);*/
            location.href = 'explorar.html';
        })
        .catch(function (error) {
            if (error.message == 'The password must be 6 characters long or more.') {
                // alert('Sua senha deve ter 6 caracteres ou mais.');
                $('.msg-escrita').text('*Sua senha deve ter 6 caracteres ou mais.');
            } else
            if (error.message == 'Password should be at least 6 characters') {
                // alert('Sua senha deve ter no mínimo 6 caracteres.');
                $('.msg-escrita').text('*Sua senha deve ter no mínimo 6 caracteres.');
            } else
            if (error.message == 'The email address is badly formatted.') {
                // alert('Email inválido.');
                $('.msg-escrita').text('*Email inválido.');
            } else
            if (error.message == 'The email address is already in use by another account.') {
                // alert('Este email já esta em uso.');
                $('.msg-escrita').text('*Este email já esta em uso.');
            } else {
                $('.msg-escrita').text('*Erro desconhecido, tente recarrega a página.');
                console.log('Erro: ' + error.message);
                console.log(error.code);
            }
            setTimeout(function () {
                $('.carregamento').modal('hide');
            }, 2000)

            $('.msg-alerta').show();
            $('.msgAguarde').hide();
        });
}


//Salva dados em Real-Time-Database
function criarUsuarioRTDB(email, nick) {
    let dadosPessoais = {
        email: email,
        nick: nick,
        seguidores: 0,
        pontos: 0
    };
    rootRef.child('usuarios').child(dadosPessoais.nick).set(dadosPessoais);
}
