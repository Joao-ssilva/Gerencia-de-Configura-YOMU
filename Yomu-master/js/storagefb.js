function listarLivros(callback1) {
    /*  OrderByKey() deveria fazer os dados aparecerem de forma  ascendente 
     * mas n está funcionando   
     */
    let refTodosLivros = rootRef.child('livros').orderByKey();
    refTodosLivros.once('value', function (snap2) {
        snap2.forEach(function (snap) {
            let livro = {
                nome: snap.key,
                descricao: snap.val().descricao,
                arqCapa: snap.val().arqCapa,
                categoria: snap.val().categoria,
                autor: snap.val().autor,
                nick:  snap.val().nick
            }

            storageRef.child('livros')
                .child(livro.nome)
                .child('capa')
                .child(livro.arqCapa)
                .getDownloadURL()
                .then(function (url) {
                    callback1(livro, url);
                }).catch(error => {
                    console.log(error.message);
                });
        });

    });
}

function listarCapasLivrosUsuarioAtual(callback, email) {
    let emailUsuario = rootRef.child('usuarios').orderByChild('email').equalTo(email);
    emailUsuario.once('child_added', function (snapEmail) {

        let livrosUsuario = rootRef.child('usuarios').child(snapEmail.val().nick).child('livros');
        
        livrosUsuario.on('child_added', function (snapLivros) {
            
            storageRef.child('livros')
                .child(snapLivros.key)
                .child('capa')
                .child('capaLivro')
                .getDownloadURL()
                .then(function (url) {
                    callback(url);
                }).catch(error => {
                    console.log(error.message);
                });

        });
    });


}


