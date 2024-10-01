const jogo = document.querySelector(".jogo-wrap");
      const mostradorTurno = document.querySelector(".turno");
      const mostradorJogador = document.querySelector(".jogador");
      const metaVitoriaEl = document.getElementById("metaVitoria");
      let turno = 1;
      const jogadasJogador1 = Array.from({ length: 9 }, () => []);
      const jogadasJogador2 = Array.from({ length: 9 }, () => []);
      const tabuleirosVencidos = Array(9).fill(null); // Registra o vencedor de cada subtabuleiro
      let jogoMeta = Array(9).fill(null); // O tabuleiro principal

      mostradorTurno.innerText = turno;
      mostradorJogador.innerText = "X"

      function combinacoesVitoriaJogoIndividual() {
        return [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [1, 4, 7],
          [2, 5, 8],
          [3, 6, 9],
          [1, 5, 9],
          [3, 5, 7],
        ];
      }

      const vitoriasIndividuais = combinacoesVitoriaJogoIndividual();

      // Gera o tabuleiro
      for (let i = 0; i < 9; i++) {
        const jogoItem = document.createElement("div");
        jogoItem.classList.add("jogo-item");
        jogoItem.id = i + 1;
        jogo.appendChild(jogoItem);

        for (let j = 0; j < 9; j++) {
          const celula = document.createElement("div");
          celula.classList.add("celula");
          celula.id = j + 1;
          jogoItem.appendChild(celula);
        }
      }

      function handleJogada(e) {
        const jogoIndividual = +e.target.parentNode.id - 1; // Subtabuleiro
        const jogada = +e.target.id; // Célula dentro do subtabuleiro

        // Verifica se o subtabuleiro já foi vencido
        if (tabuleirosVencidos[jogoIndividual]) {
          alert("Este tabuleiro já foi vencido!");
          return;
        }

        if(e.currentTarget.innerText != "") return

        // Adiciona a jogada para o jogador correto
        if (turno % 2 === 1) {
          mostradorJogador.innerText = "O"
          e.target.innerText = "X";
          jogadasJogador1[jogoIndividual].push(jogada);
          if (verificarVitoria(jogadasJogador1[jogoIndividual])) {
            marcarVitoria(jogoIndividual, "X");
          }
          turno++;
          mostradorTurno.innerText = turno;
        } else if (turno % 2 === 0) {
          mostradorJogador.innerText = "X"
          e.target.innerText = "O";
          jogadasJogador2[jogoIndividual].push(jogada);
          if (verificarVitoria(jogadasJogador2[jogoIndividual])) {
            marcarVitoria(jogoIndividual, "O");
          }
          turno++;
          mostradorTurno.innerText = turno;
        }
      }

      function verificarVitoria(jogadas) {
        // Verifica se há uma combinação de vitória nas jogadas atuais
        return vitoriasIndividuais.some((combinacao) => combinacao.every((pos) => jogadas.includes(pos)));
      }

      function marcarVitoria(tabuleiro, vencedor) {
        tabuleirosVencidos[tabuleiro] = vencedor;
        const jogoItem = document.querySelector(`.jogo-item[id="${tabuleiro + 1}"]`);
        const overlay = document.createElement("div");
        overlay.classList.add("vitoria");
        overlay.innerText = `${vencedor}`;
        jogoItem.appendChild(overlay);

        // Atualiza o jogo meta (tabuleiro principal)
        jogoMeta[tabuleiro] = vencedor;
        verificarVitoriaJogoMeta();
      }

      function verificarVitoriaJogoMeta() {
        const combinacoesMeta = combinacoesVitoriaJogoIndividual();

        // Verifica se há um vencedor no tabuleiro principal (meta-jogo)
        for (const combinacao of combinacoesMeta) {
          const [a, b, c] = combinacao;
          if (jogoMeta[a - 1] && jogoMeta[a - 1] === jogoMeta[b - 1] && jogoMeta[a - 1] === jogoMeta[c - 1]) {
            mostrarVitoriaMeta(jogoMeta[a - 1]);
            break;
          }
        }
      }

      function mostrarVitoriaMeta(vencedor) {
        metaVitoriaEl.innerText = `O jogador ${vencedor} venceu o jogo meta!`;
        // Desativa todas as células após o jogo ser vencido
        document.querySelectorAll(".celula").forEach((celula) => {
          celula.removeEventListener("click", handleJogada);
        });
      }

      // Adiciona o evento de clique em cada célula
      document.querySelectorAll(".celula").forEach((celula) => {
        celula.addEventListener("click", handleJogada);
      });