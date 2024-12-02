$(document).ready(function () {
    listarLivros(exibirLivrosExplorar);
});

let nmrId = 0;

function exibirLivrosExplorar(livro, urlImgCapa) {    
    let refLivro = rootRef.child('livros').child(livro.nome);

    refLivro.once('value', function (snap) {
        let txtCategoria = snap.val().categoria;
        let txtDescricao = snap.val().descricao;
        let txtLikes = snap.val().likes;
        let email = snap.val().autor;

        let refUsuarios = rootRef.child('usuarios')
            .orderByChild('email').equalTo(email);

        refUsuarios.on('child_added', function (snap) {

            nick = snap.val().nick;
            $('.livros > .row').append(
                html('capalivro' + nmrId,
                    'nick' + nmrId, livro.nome,
                    txtCategoria, txtDescricao, txtLikes)
            );
            $('#nick' + nmrId).text(' @' + nick);
            $('#capalivro' + nmrId).attr('src', urlImgCapa);

            nmrId++;
        });
    });

}


function html(idImgLivro, idNick, nomeLivro, categoria, descricao, likes) {
    descricao= descricao.substring(50, 0) + '...';
    let string = '';
    string = string + '<div class="col-md-3 col-sm-6 col-xs-6 d-flex justify-content-center">'
    string = string +'<div class="card">'
    string = string + '<div class="card-header row mx-0">'
    //Se tirar a linha 48 de comentario entao coloca na col abaixo col-sm-6 e col-6
    string = string + '<div class="col-sm-12 col-12 text-center">'
    string = string + '<h4 class="perfil" id="'+idNick+'"></h4>'
    string = string + '</div>'
    string = string + '<div class="col-sm-6  col-6 d-flex justify-content-end px-0">'
    //string = string + '<a href="#" class="btn btn-primary">PDF</a>'
    string = string + '</div></div>'
    string = string + '<img class="card-img-top ler" data-value="'+nomeLivro+'" id="'+idImgLivro+'" src="rsc/bruno.png">'
    string = string + '<div class="card-body ler"  data-value="'+nomeLivro+'">'
    string = string + '<p><span class="h5">'+nomeLivro+'</span>'
    string = string + '<br>#'+categoria+'<br><i class="far fa-heart">'+likes+'</i><br>'
    string = string + '<span class="card-text">'
    string = string + descricao
    string = string + '<a href="#" class="d-flex justify-content-end">Mostrar mais</a>'
    string = string + '</span></p></div></div></div>'



    $(document).ready(function () {
        $(".ler").click(function () {
            window.sessionStorage.setItem('lerLivro', $(this).attr('data-value'));
            location.href ='leitura.html';
        });
        $(".perfil").click(function () {
            /* Retorna somente o nick (tira o '@') */
            let nick = $(this).text().substring(2, $(this).text().lenght);
            window.sessionStorage.setItem('verPerfil', nick);
            location.href ='perfilVisitante.html';
        });
    })

    return string;
}
