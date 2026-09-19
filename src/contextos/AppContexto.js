import { createContext, useState } from 'react';

export const AppContexto = createContext();

export function AppProvedor({ children }) {
  const [usuario, setUsuario] = useState({ nome: 'Visitante', matricula: null });
  const [temaEscuro, setTemaEscuro] = useState(false);
  const [notificacoes, setNotificacoes] = useState([]);
  const [ultimaBusca, setUltimaBusca] = useState('');
  const [eventos, setEventos] = useState([]); //eventos adicionado

  return (
    <AppContexto.Provider
      value={{
        usuario, setUsuario,
        temaEscuro, setTemaEscuro,
        notificacoes, setNotificacoes,
        ultimaBusca, setUltimaBusca,
        eventos, setEventos,
      }}
    >
      {children}
    </AppContexto.Provider>
  );
}