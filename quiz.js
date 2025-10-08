"use strict";

(function () {
  // ===== CONSTANTES E CONFIGURAÇÕES =====
  const STORAGE_KEYS = {
    PROGRESSO: "quizProgresso",
    ESTATISTICAS: "quizEstatisticas",
    ULTIMA_SESSAO: "quizUltimaSessao",
  };

  const CONFIG = {
    SALVAR_A_CADA_RESPOSTA: true,
    MANTER_HISTORICO: true,
    TEMPO_MAXIMO_SESSAO: 7 * 24 * 60 * 60 * 1000, // 7 dias em milissegundos
  };

  // ===== ELEMENTOS DO DOM =====
  const elementos = {
    introducao: document.getElementById("introducao"),
    quizContainer: document.getElementById("quiz-container"),
    btnIniciar: document.getElementById("btn-iniciar"),
    btnContinuar: document.getElementById("btn-continuar"),
    btnVoltarInicio: document.getElementById("btn-voltar-inicio"),
    contadorQuestao: document.getElementById("contador-questao"),
    barraProgresso: document.getElementById("progresso-atual"),
    pergunta: document.getElementById("pergunta"),
    codigo: document.getElementById("codigo"),
    opcoesContainer: document.getElementById("opcoes-container"),
    feedbackContainer: document.getElementById("feedback-container"),
    respostaCorreta: document.getElementById("resposta-correta"),
    justificativa: document.getElementById("justificativa"),
    btnAnterior: document.getElementById("btn-anterior"),
    btnProximo: document.getElementById("btn-proximo"),
    resumoContainer: document.getElementById("resumo-container"),
    resumoQuestoes: document.getElementById("resumo-questoes"),
    totalAcertos: document.getElementById("total-acertos"),
    totalErros: document.getElementById("total-erros"),
    percentualAcerto: document.getElementById("percentual-acerto"),
    progressoTotal: document.getElementById("progresso-total"),
    btnReiniciar: document.getElementById("btn-reiniciar"),
    btnBaixarRelatorio: document.getElementById("btn-baixar-relatorio"),
  };

  // ===== ESTADO DO QUIZ =====
  let estadoQuiz = {
    questaoAtual: 0,
    respostasUsuario: [],
    dataInicio: null,
    tempoTotal: 0,
    questoesVisitadas: new Set(),
  };

  // ===== FUNÇÕES AUXILIARES =====
  function atualizarProgresso() {
    const respondidas = estadoQuiz.respostasUsuario.filter(
      (r) => r !== undefined && r !== null
    ).length;
    const progresso = (respondidas / exercicios.length) * 100;
    elementos.barraProgresso.style.width = `${progresso}%`;
  }

  function embaralharOpcoes(opcoes) {
    const embaralhadas = [...opcoes];
    for (let i = embaralhadas.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [embaralhadas[i], embaralhadas[j]] = [embaralhadas[j], embaralhadas[i]];
    }
    return embaralhadas;
  }

  // ===== SISTEMA DE PERSISTÊNCIA =====
  const Persistencia = {
    salvarProgresso() {
      const dados = {
        ...estadoQuiz,
        // Converter Set para Array para armazenamento
        questoesVisitadas: Array.from(estadoQuiz.questoesVisitadas),
        dataSalvamento: new Date().toISOString(),
        versao: "1.0",
      };

      try {
        localStorage.setItem(STORAGE_KEYS.PROGRESSO, JSON.stringify(dados));
        console.log("Progresso salvo com sucesso");
      } catch (e) {
        console.error("Erro ao salvar progresso:", e);
      }
    },

    carregarProgresso() {
      try {
        const progressoSalvo = localStorage.getItem(STORAGE_KEYS.PROGRESSO);
        if (!progressoSalvo) return null;

        const dados = JSON.parse(progressoSalvo);

        // Verificar se os dados são válidos e não estão expirados
        if (this.validarDados(dados)) {
          // Converter Array de volta para Set
          if (
            dados.questoesVisitadas &&
            Array.isArray(dados.questoesVisitadas)
          ) {
            dados.questoesVisitadas = new Set(dados.questoesVisitadas);
          } else {
            dados.questoesVisitadas = new Set();
          }

          // CORREÇÃO: Garantir que respostasUsuario seja um array válido
          if (
            !Array.isArray(dados.respostasUsuario) ||
            dados.respostasUsuario.length !== exercicios.length
          ) {
            dados.respostasUsuario = new Array(exercicios.length).fill(
              undefined
            );
          }

          return dados;
        } else {
          this.limparProgresso();
          return null;
        }
      } catch (e) {
        console.error("Erro ao carregar progresso:", e);
        this.limparProgresso();
        return null;
      }
    },

    validarDados(dados) {
      if (!dados || !dados.versao) return false;

      // Verificar expiração (7 dias)
      if (dados.dataSalvamento) {
        const dataSalvamento = new Date(dados.dataSalvamento);
        const agora = new Date();
        const diferenca = agora - dataSalvamento;

        if (diferenca > CONFIG.TEMPO_MAXIMO_SESSAO) {
          console.log("Sessão expirada");
          return false;
        }
      }

      // Verificar estrutura dos dados
      return Array.isArray(dados.respostasUsuario);
    },

    limparProgresso() {
      try {
        localStorage.removeItem(STORAGE_KEYS.PROGRESSO);
        console.log("Progresso limpo");
      } catch (e) {
        console.error("Erro ao limpar progresso:", e);
      }
    },

    exportarDados() {
      const progresso = this.carregarProgresso();
      const dados = {
        progresso,
        dataExportacao: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(dados, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `quiz-progresso-${
        new Date().toISOString().split("T")[0]
      }.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
  };

  // ===== GERENCIAMENTO DE QUESTÕES =====
  function criarOpcaoElemento(opcao) {
    const container = document.createElement("div");
    container.className = "opcao";
    container.innerHTML = `
            <div class="opcao-indicator"></div>
            <div class="opcao-texto">${opcao}</div>
          `;

    container.addEventListener("click", () => {
      if (!container.classList.contains("selecionada")) {
        selecionarOpcao(container, opcao);
      }
    });

    return container;
  }

  function selecionarOpcao(elementoOpcao, opcaoSelecionada) {
    const exercicio = exercicios[estadoQuiz.questaoAtual];
    estadoQuiz.respostasUsuario[estadoQuiz.questaoAtual] = opcaoSelecionada;

    const correta = opcaoSelecionada === exercicio.resposta;
    marcarOpcoes(correta, exercicio.resposta, opcaoSelecionada);
    mostrarFeedback(correta, exercicio.resposta, exercicio.justificativa);

    elementos.btnProximo.disabled = false;
    atualizarProgresso();

    if (CONFIG.SALVAR_A_CADA_RESPOSTA) {
      Persistencia.salvarProgresso();
    }
  }

  function marcarOpcoes(correta, respostaCerta, opcaoSelecionada) {
    const opcoes = elementos.opcoesContainer.querySelectorAll(".opcao");

    opcoes.forEach((opcao) => {
      const textoOpcao = opcao.querySelector(".opcao-texto").textContent;
      opcao.classList.remove("selecionada", "correta", "incorreta");

      if (textoOpcao === opcaoSelecionada) {
        opcao.classList.add("selecionada");
        opcao.classList.add(correta ? "correta" : "incorreta");
      }

      if (textoOpcao === respostaCerta && !correta) {
        opcao.classList.add("correta");
      }

      opcao.style.pointerEvents = "none";
    });
  }

  function mostrarFeedback(correta, respostaCerta, justificativa) {
    elementos.feedbackContainer.className = correta ? "correta" : "incorreta";

    elementos.respostaCorreta.innerHTML = correta
      ? "✅ <strong>Resposta Correta!</strong>"
      : `❌ <strong>Resposta Correta:</strong> ${respostaCerta}`;

    elementos.justificativa.innerHTML = `<strong>Explicação:</strong> ${justificativa}`;
    elementos.feedbackContainer.style.display = "block";
  }

  // ===== CONTROLE DE INTERFACE =====
  function mostrarQuestao(indice) {
    estadoQuiz.questaoAtual = indice;
    estadoQuiz.questoesVisitadas.add(indice);

    const exercicio = exercicios[indice];

    // Atualizar cabeçalho
    elementos.contadorQuestao.textContent = `Questão ${indice + 1} de ${
      exercicios.length
    }`;
    atualizarProgresso();

    // Atualizar pergunta
    elementos.pergunta.textContent = exercicio.pergunta;

    // Atualizar código (se houver)
    if (exercicio.codigo) {
      elementos.codigo.querySelector("code").textContent = exercicio.codigo;
      elementos.codigo.classList.remove("escondido");
    } else {
      elementos.codigo.classList.add("escondido");
    }

    // Limpar e criar opções
    elementos.opcoesContainer.innerHTML = "";
    const opcoesEmbaralhadas = embaralharOpcoes(exercicio.opcoes);

    opcoesEmbaralhadas.forEach((opcao) => {
      elementos.opcoesContainer.appendChild(criarOpcaoElemento(opcao));
    });

    // Configurar navegação
    elementos.btnAnterior.disabled = indice === 0;
    elementos.btnProximo.textContent =
      indice === exercicios.length - 1 ? "Ver Resumo" : "Próxima";

    // Restaurar estado se já respondida (tratando null e undefined)
    const respostaSalva = estadoQuiz.respostasUsuario[indice];
    if (respostaSalva !== undefined && respostaSalva !== null) {
      const correta = respostaSalva === exercicio.resposta;
      marcarOpcoes(correta, exercicio.resposta, respostaSalva);
      mostrarFeedback(correta, exercicio.resposta, exercicio.justificativa);
      elementos.btnProximo.disabled = false;
    } else {
      elementos.btnProximo.disabled = true;
    }

    // Esconder feedback inicialmente
    elementos.feedbackContainer.style.display = "none";
  }

  function mostrarResumo() {
    const respondidas = estadoQuiz.respostasUsuario.filter(
      (r) => r !== undefined && r !== null
    ).length;
    const acertos = estadoQuiz.respostasUsuario.filter(
      (resposta, index) => resposta === exercicios[index].resposta
    ).length;
    const erros = respondidas - acertos;
    const percentual =
      respondidas > 0 ? Math.round((acertos / respondidas) * 100) : 0;
    const progressoTotal = Math.round((respondidas / exercicios.length) * 100);

    // Atualizar estatísticas
    elementos.totalAcertos.textContent = acertos;
    elementos.totalErros.textContent = erros;
    elementos.percentualAcerto.textContent = `${percentual}%`;
    elementos.progressoTotal.textContent = `${progressoTotal}%`;

    // Gerar resumo das questões
    elementos.resumoQuestoes.innerHTML = "";
    exercicios.forEach((exercicio, index) => {
      const respostaUsuario = estadoQuiz.respostasUsuario[index];
      const acertou = respostaUsuario === exercicio.resposta;

      const questaoResumo = document.createElement("div");
      questaoResumo.className = `questao-resumo ${
        acertou ? "correta" : "incorreta"
      }`;
      questaoResumo.innerHTML = `
              <h4>Questão ${index + 1} ${
        exercicio.categoria ? `- ${exercicio.categoria}` : ""
      }</h4>
              <p><strong>Pergunta:</strong> ${exercicio.pergunta}</p>
              <div class="resposta-usuario"><strong>Sua resposta:</strong> ${
                respostaUsuario !== undefined && respostaUsuario !== null
                  ? respostaUsuario
                  : "Não respondida"
              }</div>
              ${
                !acertou
                  ? `<div class="resposta-correta-resumo"><strong>Resposta correta:</strong> ${exercicio.resposta}</div>`
                  : ""
              }
              <div class="justificativa-resumo"><strong>Explicação:</strong> ${
                exercicio.justificativa
              }</div>
            `;

      elementos.resumoQuestoes.appendChild(questaoResumo);
    });

    elementos.resumoContainer.classList.remove("escondido");
  }

  function verificarProgressoSalvo() {
    const progresso = Persistencia.carregarProgresso();
    const temProgresso =
      progresso &&
      progresso.respostasUsuario.some((r) => r !== undefined && r !== null) &&
      progresso.respostasUsuario.length === exercicios.length;

    elementos.btnContinuar.classList.toggle("escondido", !temProgresso);

    if (temProgresso) {
      const respondidas = progresso.respostasUsuario.filter(
        (r) => r !== undefined && r !== null
      ).length;
      elementos.btnContinuar.innerHTML = `
              Continuar de Onde Parei
              <small style="display:block; font-size:0.8em; opacity:0.8">
                ${respondidas}/${exercicios.length} questões respondidas
              </small>
            `;
    }
  }

  // ===== CONTROLE DE FLUXO =====
  function iniciarQuiz(continuar = false) {
    if (!continuar) {
      estadoQuiz = {
        questaoAtual: 0,
        respostasUsuario: new Array(exercicios.length).fill(undefined),
        dataInicio: new Date(),
        tempoTotal: 0,
        questoesVisitadas: new Set(),
      };
      Persistencia.limparProgresso();
    } else {
      const progresso = Persistencia.carregarProgresso();
      if (progresso) {
        // Garantir que o array de respostas tenha o tamanho correto
        if (progresso.respostasUsuario.length !== exercicios.length) {
          progresso.respostasUsuario = new Array(exercicios.length).fill(
            undefined
          );
        }
        estadoQuiz = progresso;
      } else {
        iniciarQuiz(false);
        return;
      }
    }

    elementos.introducao.classList.add("escondido");
    elementos.quizContainer.classList.remove("escondido");
    elementos.resumoContainer.classList.add("escondido");

    mostrarQuestao(estadoQuiz.questaoAtual);
  }

  function navegarParaQuestao(direcao) {
    const novoIndice = estadoQuiz.questaoAtual + direcao;
    if (novoIndice >= 0 && novoIndice < exercicios.length) {
      mostrarQuestao(novoIndice);
      Persistencia.salvarProgresso();
    }
  }

  function finalizarQuiz() {
    elementos.quizContainer.querySelector(".card").classList.add("escondido");
    mostrarResumo();
  }

  function reiniciarQuiz() {
    if (
      confirm(
        "Tem certeza que deseja reiniciar o quiz? Seu progresso atual será perdido."
      )
    ) {
      iniciarQuiz(false);
    }
  }

  function voltarInicio() {
    elementos.quizContainer.classList.add("escondido");
    elementos.introducao.classList.remove("escondido");
    verificarProgressoSalvo();
  }

  // ===== INICIALIZAÇÃO =====
  
  function inicializar() {
    // Event Listeners
    elementos.btnIniciar.addEventListener("click", () => iniciarQuiz(false));
    elementos.btnContinuar.addEventListener("click", () => iniciarQuiz(true));
    elementos.btnVoltarInicio.addEventListener("click", voltarInicio);
    elementos.btnAnterior.addEventListener("click", () =>
      navegarParaQuestao(-1)
    );
    elementos.btnProximo.addEventListener("click", () => {
      if (estadoQuiz.questaoAtual < exercicios.length - 1) {
        navegarParaQuestao(1);
      } else {
        finalizarQuiz();
      }
    });
    elementos.btnReiniciar.addEventListener("click", reiniciarQuiz);
    elementos.btnBaixarRelatorio.addEventListener(
      "click",
      Persistencia.exportarDados
    );

    // Verificar progresso salvo ao carregar
    verificarProgressoSalvo();

    // Salvar progresso antes de fechar a página
    window.addEventListener("beforeunload", () => {
      if (
        estadoQuiz.respostasUsuario.some((r) => r !== undefined && r !== null)
      ) {
        Persistencia.salvarProgresso();
      }
    });

    console.log("Quiz inicializado com sucesso");
  }

  // Iniciar a aplicação
  document.addEventListener("DOMContentLoaded", inicializar);
})();
