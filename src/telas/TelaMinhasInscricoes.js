import { useContext } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { AppContexto } from '../contextos/AppContexto';
import { useInscricoes } from '../contextos/InscricoesContexto';

export default function TelaMinhasInscricoes() {
  const { eventos } = useContext(AppContexto);
  const { idsInscritos, cancelar } = useInscricoes();

  // deriva a lista exibida a partir dos eventos + dos ids inscritos,
  // em vez de guardar os objetos de evento duplicados aqui
  const inscricoes = idsInscritos
    .map((id) => eventos.find((ev) => ev.id === id))
    .filter((ev) => ev !== undefined);

  console.log('[render] TelaMinhasInscricoes');

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Minhas inscrições ({inscricoes.length})
      </Text>
      <FlatList
        data={inscricoes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.linha}>
            <Text>{item.titulo}</Text>
            <Button title="Cancelar"
                    onPress={() => cancelar(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  titulo: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  linha: { flexDirection: 'row', alignItems: 'center',
          justifyContent: 'space-between', paddingVertical: 8 },
});