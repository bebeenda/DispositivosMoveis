// Este é o "estado inicial" - como tudo começa
export const estadoInicialEventos = {
  status: 'carregando',
  eventos: [],
  erro: null,
};

// Esta função recebe o estado atual + uma ação, e devolve o NOVO estado
export function eventosReducer(estado, acao) {
  switch (acao.type) {
    case 'CARREGANDO':
      return { status: 'carregando', eventos: [], erro: null };

    case 'SUCESSO':
      return { status: 'sucesso', eventos: acao.payload, erro: null };

    case 'FALHA':
      return { status: 'falha', eventos: [], erro: acao.payload };

    default:
      return estado;
  }
}