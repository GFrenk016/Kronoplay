// Hook di accesso alla libreria. Le screen importano solo questo, mai il context
// o il repository direttamente — così il "come" della persistenza resta nascosto.

import { useContext } from 'react';

import { LibraryContext } from '../context/LibraryContext';

export function useLibrary() {
  const ctx = useContext(LibraryContext);
  if (!ctx) {
    throw new Error('useLibrary deve essere usato dentro un <LibraryProvider>.');
  }
  return ctx;
}
