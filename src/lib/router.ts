import { useState, useEffect } from 'react';

export type RutaTipo = 'inicio' | 'modulo' | 'practica' | 'quiz' | 'editar';

export interface RutaActual {
  tipo: RutaTipo;
  id?: string;
  hashCompleto: string;
}

export function parsearHash(hash: string): RutaActual {
  const limpio = hash.replace(/^#\/?/, '').trim();
  const partes = limpio.split('/').filter(Boolean);

  if (partes.length === 0) {
    return { tipo: 'inicio', hashCompleto: '#/' };
  }

  const [primerSegmento, segundoSegmento] = partes;

  switch (primerSegmento) {
    case 'modulo':
      return { tipo: 'modulo', id: segundoSegmento, hashCompleto: hash };
    case 'practica':
      return { tipo: 'practica', id: segundoSegmento, hashCompleto: hash };
    case 'quiz':
      return { tipo: 'quiz', id: segundoSegmento, hashCompleto: hash };
    case 'editar':
      return { tipo: 'editar', hashCompleto: hash };
    default:
      return { tipo: 'inicio', hashCompleto: '#/' };
  }
}

export function navegarA(rutaHash: string): void {
  window.location.hash = rutaHash.startsWith('#') ? rutaHash : `#${rutaHash}`;
}

export function useHashRouter(): RutaActual {
  const [ruta, setRuta] = useState<RutaActual>(() =>
    parsearHash(window.location.hash || '#/')
  );

  useEffect(() => {
    const handleHashChange = () => {
      setRuta(parsearHash(window.location.hash || '#/'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return ruta;
}
