let nmrQuestao = 1;
function salvarQuestao() {
    
    for (let i = 0; i < document.questao.radAlter.length; i++) {
        if (document.questao.radAlter[i].checked) {

            let strPergunta = $("#pergunta").val();
            let strResposta = $('#alternativa' + (i + 1)).val();
             strResposta = $('#alternativa1').val();

            console.log('Pergunta:' + strPergunta);
            console.log('Resposta:' + strResposta);

            let questao = {
                pergunta: strPergunta,
                resposta: strResposta
            }
            let nickUsuario = window.sessionStorage.getItem('nickUsuario');
            let nomeLivro = window.sessionStorage.getItem('livro');

            rootRef.child('Questionarios/' + nomeLivro + '/questionario1/questao' + nmrQuestao).set(questao);
            rootRef.child('Questionarios/' + nomeLivro).update({nick: nickUsuario});
            let alternativas = {
                a: $('#alternativa1').val(),
                b: $('#alternativa2').val(),
                c: $('#alternativa3').val(),
            }

            rootRef.child('Questionarios/' + nomeLivro + '/questionario1/questao' + nmrQuestao +
                    '/alternativas')
                .set(alternativas);

            nmrQuestao++;
            break;
        }
        if (i == (document.questao.radAlter.length - 1)) {
            alert("Identifique a resposta da questão.");
        }
    }
    /* Limpa caixas de texto */
    $('#pergunta').val('');
    for (let i = 1; i < 6; i++) {
        $('#alternativa' + i).val('');
    }
}

$('#btnSalvar').on('click', function () {
    $('.carregamento').modal('show');
    setTimeout(function () {
        window.close();
    }, 5000);
});
