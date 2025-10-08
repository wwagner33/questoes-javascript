      // JavaScript para o funcionamento do acordeão
      document.addEventListener('DOMContentLoaded', function() {
        const acordeaoItens = document.querySelectorAll('.acordeao-item');
        
        acordeaoItens.forEach(item => {
          const cabecalho = item.querySelector('.acordeao-cabecalho');
          
          cabecalho.addEventListener('click', () => {
            // Fecha todos os outros itens
            acordeaoItens.forEach(outroItem => {
              if (outroItem !== item) {
                outroItem.classList.remove('aberto');
              }
            });
            
            // Alterna o item atual
            item.classList.toggle('aberto');
          });
        });
        
        // Opcional: Abre o primeiro item por padrão
        if (acordeaoItens.length > 0) {
          acordeaoItens[0].classList.add('aberto');
        }
      });