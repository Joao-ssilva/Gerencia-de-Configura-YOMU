let nickUsuarioAtual;
let nmrId = 0;
$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("email logado:" + user.email);

            let refLista = rootRef
                .child('usuarios')
                .orderByChild('email')
                .equalTo(user.email);

            refLista.once('child_added', function (snap) {
                nickUsuarioAtual = snap.val().nick;
                window.sessionStorage.setItem('nickUsuario', nickUsuarioAtual);
                console.log('nick:' + nickUsuarioAtual);
                listarLivros(exibirLivrosTimeline);
            });
        } else {
            console.log('***Deslogado/Sem usuário logado****');
        }
    });

    setInterval(function () {
        
        if ($('.livros > .row').html() == '') {
            let str = '';
            str = str + '<div id="coracao">'
            str = str + '<img src="rsc/coracao-quebrado.png" >'
            str = str + '<h4>Você ainda não segue ninguém</h4>'
            str = str + '<h5><b>Navegue nas categorias do explorar e<br>encontre algo que te agrade.</b></h5>'
            str = str + '<a href="explorar.html">Explorar</a>'
            str = str + '</div>'
            $('.fundo-branco > .coracao').html(str);
        } else {
            $('#coracao').hide();
        }
    }, 1000);

});


function exibirLivrosTimeline(livro, urlImgCapa) {
    /* Referência para todos os Livros */
    let refLivro = rootRef.child('livros').child(livro.nome);

    /* Adquirindo dados de todos os Livros*/
    refLivro.once('value', function (snap) {
        let txtCategoria = snap.val().categoria;
        let txtDescricao = snap.val().descricao;
        let txtLikes = snap.val().likes;
        let nickAutor = snap.val().nick;

        /* Referência para todos os autores que o usuário atual está seguindo*/
        let refSeguindo = rootRef.child('usuarios').child(nickUsuarioAtual).child('seguindo');

        /* Adquirindo o nick de cada autor que o usuário atual segue */
        refSeguindo.on('child_added', function (snapNickSeguindo) {

            /* Nick de autores que usuário atual está seguindo, adquirido */
            let nickSeguindo = snapNickSeguindo.key;
            if (nickSeguindo == nickAutor) {
                /* Adicionando ao html */

                $('.livros > .row').append(
                    html('capalivro' + nmrId,
                        'nick' + nmrId, livro.nome,
                        txtCategoria, txtDescricao, txtLikes)
                );
                $('#nick' + nmrId).text(' @' + nickSeguindo);
                $('#capalivro' + nmrId).attr('src', urlImgCapa);

                nmrId++;
            }
        });
    });
}


function html(idImgLivro, idNick, nomeLivro, categoria, descricao, likes) {
    descricao = descricao.substring(50, 0) + '...';
    let string = '';
    string = string + '<div class="col-md-3 col-sm-6 col-xs-6 d-flex justify-content-center">'
    string = string + '<div class="card">'
    string = string + '<div class="card-header row mx-0">'
    //Se tirar a linha 48 de comentario entao coloca na col abaixo col-sm-6 e col-6
    string = string + '<div class="col-sm-12 col-12 text-center">'
    string = string + '<h4 class="perfil" id="' + idNick + '"></h4>'
    string = string + '</div>'
    string = string + '<div class="col-sm-6  col-6 d-flex justify-content-end px-0">'
    //string = string + '<a href="#" class="btn btn-primary">PDF</a>'
    string = string + '</div></div>'
    string = string + '<img class="card-img-top ler" data-value="' + nomeLivro + '" id="' + idImgLivro + '" src="rsc/bruno.png">'
    string = string + '<div class="card-body ler"  data-value="' + nomeLivro + '">'
    string = string + '<p><span class="h5">' + nomeLivro + '</span>'
    string = string + '<br>#' + categoria + '<br><i class="far fa-heart">' + likes + '</i><br>'
    string = string + '<span class="card-text">'
    string = string + descricao
    string = string + '<a href="#" class="d-flex justify-content-end">Mostrar mais</a>'
    string = string + '</span></p></div></div></div>'

    $(document).ready(function () {
        $(".ler").click(function () {
            window.sessionStorage.setItem('lerLivro', $(this).attr('data-value'));
            location.href = 'leitura.html';
        });
        $(".perfil").click(function () {
            /* Retorna somente o nick (tira o '@') */
            let nick = $(this).text().substring(2, $(this).text().lenght);
            window.sessionStorage.setItem('verPerfil', nick);
            location.href = 'perfilVisitante.html';
        });
    })

    return string;
}
