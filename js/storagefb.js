function listarLivros(callback1) {
    /*  OrderByKey() deveria fazer os dados aparecerem de forma  ascendente 
     * mas n está funcionando   
     */
    let refTodosLivros = rootRef.child('livros').orderByKey();
    refTodosLivros.once('value', async function (snap2) {

        const livros = []
        snap2.forEach(livroSnap => {
            livros.push({
                nome: livroSnap.key,
                descricao: livroSnap.val().descricao,
                arqCapa: livroSnap.val().arqCapa,
                categoria: livroSnap.val().categoria,
                autor: livroSnap.val().autor,
                nick: livroSnap.val().nick
            })
        })
        const userEmail = window.localStorage.getItem('user')
        const keyStorage = `recomendacao:${userEmail}`
        const dados = JSON.parse(window.localStorage.getItem(keyStorage)) || { preferencias: [] };
        const livrosOrdenados = [...recomendarObjetos(livros, dados.preferencias)]
        for (const livroOrdenadoIndividual of livrosOrdenados) {
            const a = await storageRef.child('livros')
                .child(livroOrdenadoIndividual.nome)
                .child('capa')
                .child(livroOrdenadoIndividual.arqCapa)
                .getDownloadURL();

            console.log('livrosOrdenados', livrosOrdenados.map(a => ({ categoria: a.categoria, nome: a.nome })));
            console.log('livroOrdenadoIndividual', livroOrdenadoIndividual);
            callback1(livroOrdenadoIndividual, a);
        }

    });
}

function recomendarObjetos(livros, preferenciaUsuario) {
    // Cria um mapa para acessar rapidamente os valores de preferência
    const preferenciaMap = new Map(preferenciaUsuario);

    // Retorna um valor de preferência para a categoria (padrão 0 se não existir)
    const getPreferencia = (categoria) => preferenciaMap.get(categoria) || 0;

    // Ordena os objetos com base nas preferências
    return livros.sort((a, b) => {
        const categoriaA = a.categoria;
        const categoriaB = b.categoria;
        return getPreferencia(categoriaB) - getPreferencia(categoriaA);
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


