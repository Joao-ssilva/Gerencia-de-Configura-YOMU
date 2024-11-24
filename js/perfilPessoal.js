let nmrImg = 0;
let infoPefil = '';
let nick;

$(document).ready(function() {
    $('#btnSeguir').hide();
    $('#btnsModalProgresso').hide();
    let outroUsuario = window.localStorage.getItem('verPerfil');

    listarLivros(exibirLivrosPerfil);
    // exibirAgendaPerfil();

    meuPerfil();

    /* Botões */
    $('#btnSeguindo').click(e => {
        $('#tabelaAutores > tbody').html('');
        let refSeguindo = rootRef.child('usuarios').child(nick).child('seguindo');
        refSeguindo.on('child_added', function(snap) {
            console.log('snap.key: ' + snap.key);
            $('#tabelaAutores > tbody').append('<tr><td>' + snap.key + '</td></tr>');
        })
    });
    $('#btnSeguir').click(e => {
        addSeguidor(outroUsuario);
    });
});

function meuPerfil() {
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("usuario logado:" + user.email);
            let refLista = rootRef
                .child('usuarios')
                .orderByChild('email')
                .equalTo(user.email);

            refLista.on('child_added', function(snap) {
                nick = snap.val().nick;
                
                getQntSeguidores(nick, getSeguidores);
                getQntSeguindo(nick, getSeguindo);

                $('#pontuacao').text(snap.val().pontos);

                $('#username').html('@' + snap.val().nick);

                storageRef.child('usuarios')
                    .child(nick)
                    .child('fotoPerfil')
                    .getDownloadURL()
                    .then(function(url) {
                        /*Foto de perfil do banco de dados é enviada para a tela*/
                        $('#fotoPerfil').attr('src', url);
                    }).catch(error => {
                        console.log(error.message);
                        console.log(error.code);
                    });
            });
        } else {
            alert('***Deslogado/Sem usuário logado****');
        }
    });
    $('#inputArquivo').change(e => {
        $('.carregamento').modal('show');

        let arq = e.target.files[0];

        let stgPerfil = storageRef.child('usuarios')
            .child(nick)
            .child('fotoPerfil');

        /*Foto de perfil é enviada para o bando de dado*/
        stgPerfil.put(arq).then(function(snapshot) {
            console.log('Imagem enviada');
            setTimeout(function() {
                $('.carregamento').modal('hide');
                location.reload();
            }, 2000)
        }).catch(function(error) {
            console.log(error.code);
            console.log(error.message);
        });
    });
}

function exibirLivrosPerfil(livro, url) {

    if (nick == livro.nick) {
        let idimg = 'capa';
        let txtCategoria = livro.categoria;
        let iddescricao = livro.descricao;
        let html = htmlMeusLivros(idimg + nmrImg, livro.nome, txtCategoria, iddescricao);
        $('.meus-livros > .row').append(html);
        $('#' + idimg + nmrImg).attr('src', url);
        nmrImg++;
    }

}

function exibirAgendaPerfil(agenda, url) {
/*
    if (nick == agenda.snap.key) {
        let txtEvento = agenda.evento;
        let txtData = agenda.data;
        let html = enviaParaHtml(txtEvento, txtData);
        $('.minha-agenda > .row').append(html);
    }
*/
}

function enviaParaHtml(evento, data) {
    let string = '';
    string = string + '<div class="col-md-4">';

    string = string + '<div class="card" style="width: 18rem;">';
    string = string + '<div class="card-body">';
    string = string + '<h5 class="card-title">' + data + '</h5>';
    string = string + '<p class="card-text">' + evento + '</p>'
    string = string + '<a href="#" class="card-link">Another link</a>'
    string = string + '</div> </div> </div>';

    $(document).ready(function() {
        $(".ler").click(function() {
            window.sessionStorage.setItem('lerLivro', $(this).attr('data-value'));
            location.href = 'leitura.html';
        });
    })

    return string;
}

function htmlMeusLivros(idImgLivro, nomeLivro, txtCategoria, iddescricao) {
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

function getSeguidores(strSeguidores) {
    $('#sgdores').text(strSeguidores);
}

function getSeguindo(strSeguindo) {
    $('#sgindo').text(strSeguindo);
}

function getPontuacao(strPontos) {
    $('#pontuacao').text(strPontos);
}
