import { createContext, useCallback, useContext, useMemo, useState } from 'react';

// Não é exportado: ninguém de fora deve usar useContext(InscricoesContexto)
// diretamente. Todo mundo passa pelo hook useInscricoes() lá embaixo.
const InscricoesContexto = createContext(undefined);

export function InscricoesProvedor({ children }) {
  // guardamos só os IDs, nunca os objetos de evento inteiros
  const [idsInscritos, setIdsInscritos] = useState([]);

  const inscrever = useCallback((id) => {
    setIdsInscritos((atuais) => {
      if (atuais.includes(id)) {
        return atuais;
      }
      return [...atuais, id];
    });
  }, []);

  const cancelar = useCallback((id) => {
    setIdsInscritos((atuais) => atuais.filter((idAtual) => idAtual !== id));
  }, []);

  // useMemo evita recriar esse objeto (e re-renderizar quem usa o contexto)
  // a cada render do provedor, só recalcula quando os dados mudam de fato
  const valor = useMemo(
    () => ({ idsInscritos, inscrever, cancelar }),
    [idsInscritos, inscrever, cancelar]
  );

  return (
    <InscricoesContexto.Provider value={valor}>
      {children}
    </InscricoesContexto.Provider>
  );
}

export function useInscricoes() {
  const contexto = useContext(InscricoesContexto);

  if (contexto === undefined) {
    throw new Error(
      'useInscricoes precisa ser usado dentro de um <InscricoesProvedor>.'
    );
  }

  return contexto;
}