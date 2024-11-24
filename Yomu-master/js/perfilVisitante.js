let nmrImg = 0;
let infoPefil = '';
let nick;

$(document).ready(function () {
    let outroUsuario = window.sessionStorage.getItem('verPerfil');
    nick = outroUsuario;
    listarLivros(exibirLivrosPerfil);

    visitaPerfil(outroUsuario)

    /* Botões */
    $('#btnSeguindo').click(e => {
        $('#tabelaAutores > tbody').html('');
        let refSeguindo = rootRef.child('usuarios').child(nick).child('seguindo');
        refSeguindo.on('child_added', function (snap) {
            console.log('snap.key: ' + snap.key);
            $('#tabelaAutores > tbody').append('<tr><td>' + snap.key + '</td></tr>');
        })
    });
    $('#btnSeguir').click(e => {
        addSeguidor(outroUsuario);
    });
});

function visitaPerfil(outroUsuario) {
    console.log('este perfil é de outro usuario, vulgo: ' + outroUsuario);
    $('#username').html('@' + outroUsuario);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            let refEmail = rootRef.child('usuarios')
                .orderByChild('email')
                .equalTo(user.email);

            refEmail.once('child_added').then(snapNickUserAtual => {
                
                let usuario2 = rootRef.child('usuarios')
                    .child(snapNickUserAtual.val().nick)
                    .child('seguindo')
                    .child(outroUsuario);

                usuario2.once('value').then(snap => {
                    if (snap.exists())
                        $('#btnSeguir').text('Seguindo');
                    else
                        $('#btnSeguir').text('Seguir');

                });

            });
            let refLista = rootRef
                .child('usuarios')
                .child(outroUsuario);

            refLista.on('child_added', function (snap) {
                
                storageRef.child('usuarios')
                    .child(outroUsuario)
                    .child('fotoPerfil')
                    .getDownloadURL()
                    .then(function (url) {
                        $('#fotoPerfil').attr('src', url);
                    }).catch(error => {
                        console.log(error.message);
                    });
            });

            getQntSeguidores(outroUsuario, getSeguidores);
            getQntSeguindo(outroUsuario, getSeguindo);
            getNmrPontos(outroUsuario, getPontuacao);
           
            $('#btnSeguir').attr('data-toggle', 'modal');
            $('#btnSeguir').attr('data-target', '#mensagemModal');
        } else {
            alert('***Deslogado/Sem usuário logado****');
        }
    });
}

function exibirLivrosPerfil(livro, url) {

    if (nick == livro.nick) {
        let idimg = 'capa';
        let txtCategoria = livro.categoria;
        let iddescricao = livro.descricao;
        let html = enviaParaHtml(idimg + nmrImg, livro.nome, txtCategoria, iddescricao);
        let html2 = enviaParaHtml2(livro.nome, txtCategoria);
        $('.meus-livros > .row').append(html);
        $('#' + idimg + nmrImg).attr('src', url);
        nmrImg++;
    }

}

function enviaParaHtml(idImgLivro, nomeLivro, txtCategoria, iddescricao) {
    iddescricao= iddescricao.substring(50, 0) + '...';
    let string = '';
    string = string + '<div class="col-md-3 col-sm-6 col-xs-6 d-flex justify-content-center">'
    string = string + '<div class="card">'
    string = string + '<div class="card-header row mx-0">'
    //Se tirar a linha 48 de comentario entao coloca na col abaixo col-sm-6 e col-6
    string = string + '<div class="col-sm-12 col-12 text-center">'
    string = string + '</div>'
    string = string + '<div class="col-sm-6  col-6 d-flex justify-content-end px-0">'
    //string = string + '<a href="#" class="btn btn-primary">PDF</a>'
    string = string + '</div></div>'
    string = string + '<img class="card-img-top ler" data-value="' + nomeLivro + '" id="' + idImgLivro + '" src="rsc/bruno.png">'
    string = string + '<div class="card-body ler"  data-value="' + nomeLivro + '">'
    string = string + '<p><span class="h5">' + nomeLivro + '</span>'
    string = string + '<br>#' + txtCategoria + '<br><i class="far fa-heart">100</i><br>'
    string = string + '<span class="card-text">'
    string = string + iddescricao
    string = string + '<a href="#" class="d-flex justify-content-end">Mostrar mais</a>'
    string = string + '</span></p></div></div></div>'
    $(document).ready(function () {
        $(".ler").click(function () {
            window.sessionStorage.setItem('lerLivro', $(this).attr('data-value'));
            location.href = 'leitura.html';
        });
    })

    return string;
}

function enviaParaHtml2(nome, txtCategoria) {
    let string = '<tr>';
    string = string + '<td>' + nome + '</td>';
    string = string + '<td>' + txtCategoria + '</td>';
    string = string + '</tr> ';

    return string;
}

function getSeguidores(strSeguidores) {
    $('#sgdores').text(strSeguidores);
}

function getSeguindo(strSeguindo) {
    $('#sgindo').text(strSeguindo);
}

function getPontuacao(strPontos) {
    $('#pontuacao').text(strPontos);
}

function addSeguidor(nickSeguido) {
    var userAtual = firebase.auth().currentUser;

    let refEmail = rootRef.child('usuarios')
        .orderByChild('email')
        .equalTo(userAtual.email);

    let refSeguido = rootRef.child('usuarios')
        .child(nickSeguido);

    refSeguido.once('value').then(snapSeguir => {
        refEmail.once('child_added').then(snapNickSeguidor => {

            let refUserAtual = rootRef.child('usuarios').child(snapNickSeguidor.val().nick)
                .child('seguindo').child(nickSeguido);

            refUserAtual.once('value').then(snap => {
                if (!snap.exists()) {
                    /* Começa a seguir*/
                    refUserAtual.set({
                        email: snapSeguir.val().email
                    });

                    refSeguido.update({
                        seguidores: ++snapSeguir.val().seguidores
                    });

                    $('#btnSeguir').text('Seguindo');
                    console.log('voce comecou a seguir')
                } else {
                    /* Caso ele esteja seguindo ele para de seguir se apertar o botão de novo */
                    refUserAtual.set({});

                    refSeguido.update({
                        seguidores: --snapSeguir.val().seguidores
                    });

                    $('#btnSeguir').text('Seguir');
                    console.log('voce deixou de seguir')
                }
            });

        });
    });
}
