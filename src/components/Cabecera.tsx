import React from 'react';
import { navegarA } from '../lib/router';
import { IconoAjuste, IconoFlechaIzquierda } from './Iconos';

interface CabeceraProps {
  titulo?: string;
  esModoEditor?: boolean;
}

export const Cabecera: React.FC<CabeceraProps> = ({ esModoEditor = false }) => {
  return (
    <header className="cabecera-app" role="banner">
      <div 
        className="logo-ori" 
        onClick={() => navegarA('#/')} 
        style={{ cursor: 'pointer' }}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') navegarA('#/'); }}
        aria-label="Ir al inicio de Ori Café"
      >
        {/* Emblema artesanal minimalista de Ori Café */}
        <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="20" cy="20" r="19" stroke="var(--texto-principal)" strokeWidth="1.5" strokeDasharray="2 2" />
          <path d="M12 17h13v7a6.5 6.5 0 0 1-6.5 6.5h0A6.5 6.5 0 0 1 12 24V17Z" stroke="var(--texto-principal)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M25 19.5h2.5a2.5 2.5 0 0 1 0 5H25" stroke="var(--texto-principal)" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 11c0 2-1.5 2.5-1.5 4m5-4c0 2-1.5 2.5-1.5 4" stroke="var(--acento)" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <div>
          <h1>Ori Café</h1>
          <span className="sub-logo">BARRA SANTIAGO • EST. 2024</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {esModoEditor ? (
          <button 
            type="button" 
            className="btn btn-secundario btn-sm"
            onClick={() => navegarA('#/')}
            aria-label="Volver a la vista del barista"
          >
            <IconoFlechaIzquierda size={14} /> Volver a Barra
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-secundario btn-sm"
            onClick={() => navegarA('#/editar')}
            title="Editar contenido y recetas"
            aria-label="Abrir modo editor del encargado"
          >
            <IconoAjuste size={14} /> Modo Editor
          </button>
        )}
      </div>
    </header>
  );
};
