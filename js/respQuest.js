 let nmrQuestao;
 let pontos;
 let nomeLivro;
 let nickUsuario;
 $(document).ready(function () {
     nmrQuestao = window.sessionStorage.getItem('questao');
     pontos = window.sessionStorage.getItem('pontos');
     nickUsuario = window.sessionStorage.getItem('nickUsuario');
     nomeLivro = window.sessionStorage.getItem('lerLivro');
     
     if (pontos == null || pontos < 0) {
         pontos = 0;
         window.sessionStorage.setItem('pontos', pontos);
     }
     if (nmrQuestao == null) {
         window.sessionStorage.setItem('questao', 1);
         location.reload();
         carregaQuestao(1);
     } else {
         carregaQuestao(nmrQuestao);
     }

 });

 $('#proximo').click(function () {
     validarQuestao(nmrQuestao);
 });
 $('#anterior').click(function () {
     subtrairNmrQuestao();
     subtrairPontos();
     location.reload();
 });

 function carregaQuestao(nQuestao) {
 
     let alt = rootRef.child('Questionarios/' + nomeLivro + '/questionario1/questao' + nQuestao +
         '/alternativas');
     let perg = rootRef.child('Questionarios/' + nomeLivro + '/questionario1/questao' + nQuestao);
     perg.once('value').then(function (snap) {
         if (snap.exists()) {
             $('#pergunta').text(snap.val().pergunta);
             alt.once('value').then(function (snap) {
                 $('#alternativa1').text(snap.val().a);
                 $('#alternativa2').text(snap.val().b);
                 $('#alternativa3').text(snap.val().c);
             });
         } else {
             console.log('Pontos salvos para ' + nickUsuario);
             rootRef.child('usuarios/' + nickUsuario).once('value').then(function (snapPontos) {
                 let pontosGuardados = snapPontos.val().pontos;
                 let totalP = Number(pontos) + Number(pontosGuardados);
                 rootRef.child('usuarios/' + nickUsuario).update({
                     pontos: totalP
                 });
                 rootRef.child('usuarios/' + nickUsuario + '/questionariosRespondidos/' + nomeLivro).set({
                     questionario: 'respondido'
                 });
                 $('#modalAlerta').modal('show');
                 $('#modalPontos').html('Você acertou: '+pontos+'<br>Total de pontos: '+totalP);
             });

         }

     });

 }

 function validarQuestao(nQuestao) {
     for (let i = 0; i < document.questao.radAlter.length; i++) {
         if (document.questao.radAlter[i].checked) {
             let perg = rootRef.child('Questionarios/' + nomeLivro + '/questionario1/questao' + nQuestao);
             perg.once('value').then(function (snapR) {
                 let strResposta = $('#alternativa' + (i + 1)).text();
                 let resposta = snapR.val().resposta;
                 console.log(resposta);
                 if (resposta == strResposta) {
                     somarPontos();
                 }
                 somarNmrQuestao();
                      location.reload();
                 
             });
             break;
         }
     }
 }



 function somarNmrQuestao() {
     nmrQuestao = window.sessionStorage.getItem('questao')
     nmrQuestao++;
     window.sessionStorage.setItem('questao', nmrQuestao);
 }

 function subtrairNmrQuestao() {
     nmrQuestao = window.sessionStorage.getItem('questao')
     nmrQuestao--;
     window.sessionStorage.setItem('questao', nmrQuestao);
 }

 function somarPontos() {
     pontos = window.sessionStorage.getItem('pontos');
     pontos++;
     window.sessionStorage.setItem('pontos', pontos);
 }

 function subtrairPontos() {
     pontos = window.sessionStorage.getItem('pontos');
     pontos--;
     window.sessionStorage.setItem('pontos', pontos);
 }
