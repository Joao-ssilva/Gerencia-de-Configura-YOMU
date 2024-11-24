 function enviarFormCad() {
     if (conferirSenhas()) {
         realizarCadastro();
     } else {
         // alert('As senhas não correspondem!');
         $('#mensagemCadastrar').text('*As senhas não correspondem.');
         $('#avisoCadastrar').show();
     }
 }

 function conferirSenhas() {
     let senha = $('#senhaInput').val();
     let confSenha = $('#senhaInputConf').val();

     return (senha == confSenha) ? true : false;
 }
