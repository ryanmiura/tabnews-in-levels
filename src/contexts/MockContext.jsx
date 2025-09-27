import { createContext, useContext, useState } from 'react';

const MockContext = createContext();

export const MockProvider = ({ children }) => {
  // Por padrão, inicia com API real (false = não usar mocks)
  const [useMocks, setUseMocks] = useState(false);

  const toggleMocks = () => {
    setUseMocks(prev => !prev);
    console.log(useMocks ? 'Mudando para API real' : 'Mudando para dados mockados');
  };

  return (
    <MockContext.Provider value={{
      useMocks,
      setUseMocks,
      toggleMocks
    }}>
      {children}
    </MockContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMockContext = () => {
  const context = useContext(MockContext);
  
  if (!context) {
    throw new Error('useMockContext deve ser usado dentro de um MockProvider');
  }
  
  return context;
};

export default MockContext;