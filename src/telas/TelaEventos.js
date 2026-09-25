import { useContext, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text, TextInput,
  View,
} from 'react-native';
import CartaoEvento from '../componentes/CartaoEvento';
import { AppContexto } from '../contextos/AppContexto';
import { useInscricoes } from '../contextos/InscricoesContexto';
import { eventosReducer, estadoInicialEventos } from '../reducers/eventosReducer';

export default function TelaEventos({ navigation }) {
  const { temaEscuro, setEventos } = useContext(AppContexto);
  const { idsInscritos, inscrever: inscreverNoContexto } = useInscricoes();
  //Antes: 3 variáveis booleanas/nulas independentes (carregando, erro, enviado) → 2 × 2 × 2 = 8 combinações possíveis, a maioria sem sentido (ex: carregando + erro + enviado juntos).
  //Depois: 1 campo status com 3 valores mutuamente exclusivos → 3 combinações possíveis, todas fazendo sentido.

  const [estado, dispatch] = useReducer(eventosReducer, estadoInicialEventos);

  const [busca, setBusca] = useState('');
  const [eventoSelecionadoId, setEventoSelecionadoId] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    dispatch({ type: 'CARREGANDO' });
    fetch('https://api.campus.iftm.edu.br/eventos', { signal: controller.signal })
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`Erro HTTP: ${resposta.status}`);
        }
        return resposta.json();
      })
      .then((dados) => {
        dispatch({ type: 'SUCESSO', payload: dados });
      })
      .catch((e) => {
        // requisição cancelada porque saímos da tela: não é uma falha real
        if (e.name === 'AbortError') {
          return;
        }
        dispatch({ type: 'FALHA', payload: e.message });
      });

    // função de limpeza: roda quando o componente sai da tela (desmonta)
    return () => {
      controller.abort();
    };
  }, []);

  // mantém o AppContexto sincronizado, pois a TelaDetalheEvento
  // lê a lista de eventos a partir do contexto, não do reducer
  useEffect(() => {
    if (estado.status === 'sucesso') {
      setEventos(estado.eventos);
    }
  }, [estado.status, estado.eventos]);

  const eventosFiltrados = estado.eventos.filter((ev) =>
    ev.titulo.toLowerCase().includes(busca.toLowerCase())
  );
  const totalInscricoes = idsInscritos.length;

  // busca o objeto só na hora de exibir o aviso, a partir do id guardado
  const eventoSelecionado = estado.eventos.find((ev) => ev.id === eventoSelecionadoId);

  // "enviado" não existe mais como estado próprio: agora é derivado
  const enviado = eventoSelecionadoId !== null;

  function inscrever(evento) {
    inscreverNoContexto(evento.id);
    setEventoSelecionadoId(evento.id);
  }

  console.log('[render] TelaEventos');

  return (
    <View style={[styles.container,
      { backgroundColor: temaEscuro ? '#121212' : '#FFFFFF' }]}>
      <Text style={styles.contador}>Inscrições: {totalInscricoes}</Text>
      <TextInput
        style={styles.campo}
        value={busca}
        onChangeText={setBusca}
        placeholder="Buscar evento"
      />
      {estado.status === 'carregando' && <ActivityIndicator size="large" />}
      {estado.status === 'falha' && (
        <Text style={styles.erro}>Falha: {estado.erro}</Text>
      )}
      {enviado && eventoSelecionado && (
        <Text style={styles.aviso}>
          Inscrição confirmada em {eventoSelecionado.titulo}
        </Text>
      )}
      <FlatList
        data={eventosFiltrados}
        keyExtractor={(itemLista) => String(itemLista.id)}
        renderItem={({ item }) => (
          <CartaoEvento
            evento={item}
            aoInscrever={() => inscrever(item)}
            aoAbrir={() =>
              navigation.navigate('Detalhe', { id: item.id })}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  contador: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  campo: { borderWidth: 1, borderColor: '#CCCCCC', borderRadius: 8,
           padding: 10, marginBottom: 12 },
  erro: { color: '#B00020', marginBottom: 8 },
  aviso: { color: '#2E7D32', marginBottom: 8 },
});