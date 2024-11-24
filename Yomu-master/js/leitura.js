$(document).ready(function () {
    let refListaLivros = rootRef.child('livros');
    abrirCap(window.sessionStorage.getItem('lerLivro'));
    $(".btn-like").click(() => {
        addLike(window.sessionStorage.getItem('lerLivro'));
    });

    verificaLike(window.sessionStorage.getItem('lerLivro'));
    //Parada de responsividade
    function observaResponsividade(obs) {
        if (obs.matches) {
            $('#parte-capa').removeClass('col-sm-4').addClass('col-sm-12');
            $('#parte-conteudo').removeClass('col-sm-8').addClass('col-sm-12');
        } else {
            $('#parte-capa').removeClass('col-sm-12').addClass('col-sm-4');
            $('#parte-conteudo').removeClass('col-sm-12').addClass('col-sm-8');
        }
    }

    var obs = window.matchMedia("(max-width: 870px)");
    observaResponsividade(obs);
    obs.addListener(observaResponsividade)
});

function abrirCap(nomeLivro) {
    getCapa(nomeLivro);
    getInfomacoes(nomeLivro);
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
                mostrarDescricao(nomeLivro);
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

function getCapa(nomeLivro) {
    let refArq = rootRef.child('livros')
        .child(nomeLivro)
        .orderByChild('arqCapa');

    refArq.on('value', function (snap) {
        let nomeCapa = snap.val().arqCapa;
        console.log("nome arquivo: " + snap.val().arqCapa);

        storageRef.child('livros')
            .child(nomeLivro)
            .child('capa')
            .child(nomeCapa)
            .getDownloadURL()
            .then(function (url) {
                $('#capa').attr('src', url);
            }).catch(function (error) {
                console.log(error.message);
            });
    });
}

function getInfomacoes(nomeLivro) {
    let refDesc = rootRef.child('livros')
        .child(nomeLivro);

    refDesc.on('value', function (snap) {
        console.log(snap.val().descricao);
        $('.descricao ').html(snap.val().descricao);
        $('.like > button > i').html(' ' + snap.val().likes);
        $('.titulo > .text-roxo').html(snap.key);
        $('.autor > .text-roxo').html('@' + snap.val().nick);
        $('.categoria > span').html('#' + snap.val().categoria);
    });

}

function addLike(nomeLivro) {
    let usuario = firebase.auth().currentUser;

    let refLivro = rootRef.child('livros')
        .child(nomeLivro);

    let refUsuario = rootRef.child('usuarios')
        .orderByChild('email')
        .equalTo(usuario.email);


    refUsuario.once('child_added').then(snapUsuario => {
        let refLikes = rootRef.child('usuarios')
            .child(snapUsuario.val().nick)
            .child('likes')
            .child(nomeLivro);

        refLivro.once('value').then(snapLivro => {
            refLikes.once('value').then(snapLike => {
                /*Verifica se já votei nesse livro*/
                if (!snapLike.exists()) {
                    /*Atualiza quantidade de likes do livro*/
                    refLivro.update({
                        likes: ++snapLivro.val().likes
                    });

                    /*Salva o nome do livro no nó 'likes'*/
                    rootRef.child('usuarios')
                        .child(snapUsuario.val().nick)
                        .child('likes')
                        .child(nomeLivro)
                        .set({
                            nome: nomeLivro
                        });

                    $('.btn-like > i').removeClass('far').addClass('fas');
                } else {
                    refLivro.update({
                        likes: --snapLivro.val().likes
                    });
                     /*Apaga nome do livro do nó 'likes'*/
                    rootRef.child('usuarios')
                        .child(snapUsuario.val().nick)
                        .child('likes')
                        .child(nomeLivro)
                        .set({});
                    $('.btn-like > i').removeClass('fas').addClass('far');
                }
            });
        });
    });
}

function verificaLike(nomeLivro) {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let refEmail = rootRef.child('usuarios')
                .orderByChild('email')
                .equalTo(user.email);

            refEmail.once('child_added').then(snapNickUserAtual => {

                let livroComLike = rootRef.child('usuarios')
                    .child(snapNickUserAtual.val().nick)
                    .child('likes')
                    .child(nomeLivro);

                /*Verifica se tem algo dentro de like*/
                livroComLike.once('value').then(snap => {
                    if (snap.exists())
                        $('.btn-like > i').removeClass('far').addClass('fas');
                    else
                        $('.btn-like > i').removeClass('fas').addClass('far');
                });

            });


        } else {
            alert('***Deslogado/Sem usuário logado****');
        }
    });
}