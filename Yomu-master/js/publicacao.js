let arqCapitulo;
let nomeCapitulo;
let arqCapa;
let nomeCapa;

$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            listarNomesLivrosUsuarioAtual(addLivroSelect, user.email);
            rootRef.child('usuarios').orderByChild('email').equalTo(user.email).once('child_added', function (snapEmail) {
                window.sessionStorage.setItem('nickUsuario', snapEmail.val().nick);
            });
        } else {
            console.log('***Deslogado/Sem usuário logado****');
        }
    });

    // Captura arquivo(capitulo)
    $('#btnSelecionarArquivo').change(function (e) {
        arqCapitulo = e.target.files[0];
        nomeCapitulo = arqCapitulo.name;
    });
    //Captura arquivo (capa)
    $('#inputArquivo').change(function (e) {
        arqCapa = e.target.files[0];
        nomeCapa = 'capaLivro';
    });

    $('.listaLivros').change(function () {
        let estado = $('.listaLivros');
        console.log(estado.val());
        if (estado.val() != 'Novo') {
            exibirConfigLivroExistente(estado.val());
            abrirCap(estado.val());
        } else {

            exibirConfigLivroNovo(estado.val());
        }

    });
});

function abrirCap(nomeLivro) {
    let string = '';
    let refListaCap = rootRef.child('livros').child(nomeLivro);

    refListaCap.on('child_added', function (snap) {
        if (snap.key != 'descricao' &&
            snap.key != 'categoria' &&
            snap.key != 'arqCapa' &&
            snap.key != 'autor' &&
            snap.key != 'nick' &&
            snap.key != 'likes') {
            string = string + '<li class="border-bottom border-roxo cap-link" data-value="' + snap.key + '">' + snap.key + '</li>'
            $('.caps').html(string);
            $('.cap-link').click(function () {
                irParaPDf($(this).attr('data-value'), nomeLivro);
            });
        }
    });
}

function irParaPDf(nomeCap, nomeLivro) {
    $('.carregamento').modal('show');
    let refArq = rootRef.child('livros')
        .child(nomeLivro)
        .child(nomeCap)
        .orderByChild('arquivo');
    console.log(nomeCap);
    console.log(nomeLivro)

    refArq.on('child_added', function (snap) {
        let nomeArq = snap.val();
        storageRef.child('livros')
            .child(nomeLivro)
            .child('capitulos')
            .child(nomeArq)
            .getDownloadURL()
            .then(function (url) {
                window.sessionStorage.setItem('urlLivro', url);
                setTimeout(function () {
                    $('.carregamento').modal('hide');
                    window.open("telaCapitulo.html", "_blank");
                }, 2000)

            }).catch(function (error) {
                console.log(error.message);
            });
    });
}

function addLivroSelect(nomeLivro) {
    $('.listaLivros').append('<option>' + nomeLivro + '</option>');
}

function exibirConfigLivroExistente(nomeLivro) {

    $('#btnPublicar').val('Atualizar');
    $('#inputNomePublicacao').val(nomeLivro);
    $('#inputNomePublicacao').attr('readonly', 'true');
    rootRef.child('livros/' + nomeLivro).once('value').then(function (snap) {
        $('#inputDescricao').val(snap.val().descricao)
    });

    $('#lAlterar').hide();
    listarCapasLivrosUsuarioAtual(addSrc, firebase.auth().currentUser.email);

    function addSrc(url) {
        $('#capa').attr('src', url);
    }
}

function exibirConfigLivroNovo() {
    $('#btnPublicar').val('Publicar');
    $('#inputNomePublicacao').val('');
    $('#inputNomePublicacao').removeAttr('readonly');
    $('#inputDescricao').val('');
    $('#inputDescricao').removeAttr('readonly');
    $('#capa').attr('src', 'rsc/perfil-avatar.png');
    $('#lAlterar').show();
}

function publicarLivro() {
    $('.carregamento').modal('show');
    let inputNomePublicacao = $('#inputNomePublicacao').val();
    if (!verificaInputs()) {
        verificaExistenciaLivro(inputNomePublicacao, novoLivro, atualizarLivro);
    }else{
        alert('Nenhum capitulo adicionado');
    }
}

function verificaInputs() {
    return $('.caps').html() === '';
}

function verificaExistenciaLivro(nomeLivro, callback1, callback2) {
    let x = rootRef.child('livros').orderByKey().equalTo(nomeLivro);
    x.once('value', function (snap) {
        if (snap.exists()) {
            console.log('este livro já existe! e está sendo atualizado');
            callback2();
        } else {
            console.log('este livro não existe! até agr...');
            callback1();
        }
    });
}

function novoLivro() {

    let inputNomePublicacao = $('#inputNomePublicacao').val();
    let inputDescricao = $('#inputDescricao').val();
    let inputNomeCap = $('#inputNomeCap').val();
    let selectCategoria = $('#selectCategoria').val();
    let usuario = firebase.auth().currentUser;
    let refLista = rootRef
        .child('usuarios')
        .orderByChild('email')
        .equalTo(usuario.email);
    refLista.once('child_added', function (snap) {

        let dadosCap = {
            arquivo: inputNomeCap
        };

        let dadosLivro = {
            descricao: inputDescricao,
            arqCapa: nomeCapa,
            categoria: selectCategoria,
            autor: usuario.email,
            nick: snap.val().nick,
            likes: 0
        };
        console.log(dadosLivro)
        // Envia dados para RealTime-Database (usuarios -> livros )
        attRTDBUsuariosLivro(snap.val().nick, inputNomePublicacao, inputNomeCap, dadosCap);

        // Enviar dados para o RealTime-Database (livros)
        addRTDBLivro(inputNomePublicacao, inputNomeCap, dadosLivro, dadosCap);

        // Enviar arquivos para o Storage livros do Firebase
        addStgLivro(inputNomePublicacao, inputNomeCap, nomeCapa, arqCapitulo, arqCapa);
    });
}

function atualizarLivro() {
    let inputNomePublicacao = $('#inputNomePublicacao').val();
    let inputDescricao = $('#inputDescricao').val();
    let inputNomeCap = $('#inputNomeCap').val();
    let selectCategoria = $('#selectCategoria').val();
    let usuario = firebase.auth().currentUser;
    let dadosCap = {
        arquivo: inputNomeCap
    };
    let dadosLivro = {
        descricao: inputDescricao,
        categoria: selectCategoria,
        autor: usuario.email
    };

    let refLista = rootRef
        .child('usuarios')
        .orderByChild('email')
        .equalTo(usuario.email);

    // Enviar dados para RealTime-Database (usuarios -> livros )
    refLista.on('child_added', function (snap) {
        attRTDBUsuariosLivro(snap.val().nick, inputNomePublicacao, inputNomeCap, dadosCap);
    });

    // Enviar dados para o RealTime-Database (livros)
    attRTDBLivro(inputNomePublicacao, inputNomeCap, dadosLivro, dadosCap);

    // Enviar arquivos para o Storage livros do Firebase
    atualizarStgLivro(inputNomePublicacao, inputNomeCap, arqCapitulo);
}

function addRTDBLivro(nomeLivro, nomeCapitulo, infoLivro, infoCapitulo) {
    rootRef.child('livros')
        .child(nomeLivro)
        .set(infoLivro);

    rootRef.child('livros')
        .child(nomeLivro)
        .child(nomeCapitulo)
        .set(infoCapitulo);
}

function attRTDBLivro(nomeLivro, novoCapitulo, attLivro, attCapitulo) {
    rootRef.child('livros')
        .child(nomeLivro)
        .update(attLivro);
    rootRef.child('livros')
        .child(nomeLivro)
        .child(novoCapitulo)
        .update(attCapitulo);
}

function addRTDBUsuariosLivro(nick, nomeLivro, nomeCapitulo, infoCapitulo) {
    rootRef.child('usuarios')
        .child(nick)
        .child('livros')
        .child(nomeLivro)
        .child(nomeCapitulo)
        .set(infoCapitulo);
}

function attRTDBUsuariosLivro(nick, nomeLivro, novoCapitulo, attCapitulo) {

    rootRef.child('usuarios')
        .child(nick)
        .child('livros')
        .child(nomeLivro)
        .child(novoCapitulo)
        .set(attCapitulo);
}

function addStgLivro(cLivro, cCapitulo, cCapa, arqCapitulo, arqCapa) {
    let stgLivros = storageRef
        .child('livros')
        .child(cLivro)
        .child('capitulos')
        .child(cCapitulo);
    let stgCapa = storageRef
        .child('livros')
        .child(cLivro)
        .child('capa')
        .child('capaLivro');

    console.log(arqCapa);
    stgLivros.put(arqCapitulo).then(function (snapshot) {
        stgCapa.put(arqCapa).then(function (snapshot) {
            /*PUBLICAÇÃO CONCLUIDA*/
            setTimeout(function () {
                $('.carregamento').modal('hide');
                location.reload();
            }, 2000)
        }).catch(function (error) {
            console.log('erro no envio da capa: ' + error.code);
            console.log('erro no envio da capa: ' + error.message);
        });
    }).catch(function (error) {
        console.log('erro: ' + error.code);
        console.log('erro: ' + error.message);
    });

}

function atualizarStgLivro(cLivro, cCapitulo, arqCapitulo) {
    let stgLivros = storageRef
        .child('livros')
        .child(cLivro)
        .child('capitulos')
        .child(cCapitulo);
    stgLivros.put(arqCapitulo).then(function (snapshot) {
        /*ATUALIZAÇÃO CONCLUIDA*/
        setTimeout(function () {
            $('.carregamento').modal('hide');
            location.reload();
        }, 2000)
    }).catch(function (error) {
        console.log('erro: ' + error.code);
        console.log('erro: ' + error.message);
    });
}
