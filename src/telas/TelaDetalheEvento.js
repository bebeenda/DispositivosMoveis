import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppContexto } from '../contextos/AppContexto';

export default function TelaDetalheEvento({ route }) {
  const { id } = route.params;
  const { eventos } = useContext(AppContexto);

  const evento = eventos.find((ev) => ev.id === id);

  // caso o evento não exista mais na lista ele cai nesse if aqui
  if (!evento) {
    return (
      <View style={styles.container}>
        <Text style={styles.texto}>Este evento não está mais disponível.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>{evento.titulo}</Text>
      <Text style={styles.texto}>{evento.descricao}</Text>
      <Text style={styles.texto}>Vagas restantes: {evento.vagas}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 8 },
  titulo: { fontSize: 22, fontWeight: 'bold' },
  texto: { fontSize: 16 },
});