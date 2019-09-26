  function chamarSlug(){
    var categoriaPostagem = document.querySelector("#categoriaPostagem");
    var slugPostagemCompleto = document.querySelector("#slugPostagemCompleto"); 
    var slugPostagem = document.querySelector("#slugPostagem").value;
 
    if(slugPostagem == null || slugPostagem.length == 0){
      slugPostagemCompleto.value = categoriaPostagem.value + "/";
    }
    else if(slugPostagem.length  > 0){
      slugPostagemCompleto.value = categoriaPostagem.value + "/" + slugPostagem;
    }

  }

