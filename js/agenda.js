/*
let nmrImg = 0;
let infoPefil = '';
let nick;

function exibirLivrosPerfil(agenda, url) {

    if (nick == agenda.nick) {
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
    $(document).ready(function() {
        $(".ler").click(function() {
            window.sessionStorage.setItem('lerLivro', $(this).attr('data-value'));
            location.href = 'leitura.html';
        });
    })

    return string;
}

*/