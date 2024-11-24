/*
$(document).ready(() => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            console.log("usuario logado:" + user.email);
        } else {
            console.log('***Deslogado/Sem usuário logado****');
        }
    });
});
*/


function jaVotou() {
    let refLikes = rootRef.child('usuarios')
        .child(snapUsuario.val().nick)
        .child('likes')
        .child('nomeLivro');
    console.log(refLikes);
}

function listarNomesLivrosUsuarioAtual(callback, email) {
    let emailUsuario = rootRef.child('usuarios').orderByChild('email').equalTo(email);
    emailUsuario.once('child_added', function (snapEmail) {
        let livrosUsuario = rootRef.child('usuarios').child(snapEmail.val().nick).child('livros');
        livrosUsuario.on('child_added', function (snapLivros) {
            console.log('livro:' + snapLivros.key);
            callback(snapLivros.key);
        });
    });
}


function getQntSeguidores(nick, callback) {
    let refSeguidores = rootRef.child('usuarios').child(nick);
    refSeguidores.once('value').then(snap => {
        console.log('seguidores:' + snap.val().seguidores);
        callback( snap.val().seguidores);
    });
}

function getQntSeguindo(nick, callback) {
    let refSeguindo = rootRef.child('usuarios').child(nick).child('seguindo');
    refSeguindo.once('value').then(snap => {
        console.log('qnt que está seguindo:' + snap.numChildren());
        callback(snap.numChildren());
    });
}

function getNmrPontos(nick, callback) {
    let refSeguindo = rootRef.child('usuarios').child(nick);
    refSeguindo.once('value').then(snap => {
        callback(snap.val().pontos);
    });
}