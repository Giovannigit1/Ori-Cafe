import React from 'react';
import { TipoLeche } from '../lib/tipos';
import { IconoAlerta } from './Iconos';

interface TarjetaLecheProps {
  leche: TipoLeche;
}

export const TarjetaLeche: React.FC<TarjetaLecheProps> = ({ leche }) => {
  const esVegetal = leche.grupo === 'vegetal';

  return (
    <div
      className={`tarjeta ${esVegetal ? 'tarjeta-verde' : 'tarjeta-destacada'}`}
      style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
    >
      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div>
          <span className={`badge ${esVegetal ? 'badge-verde' : 'badge-acento'}`}>
            {esVegetal ? 'BEBIDA VEGETAL' : 'LÁCTEO VACUNO'}
          </span>
          <h3 style={{ fontSize: '1.25rem', marginTop: '4px' }}>{leche.nombre}</h3>
        </div>
        <span
          className="mono"
          style={{
            fontSize: '0.85rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '4px',
            backgroundColor: esVegetal ? 'var(--verde)' : 'var(--acento)',
            color: '#FFFFFF',
          }}
        >
          {leche.temperatura}
        </span>
      </div>

      {/* Tiempos de aireado y barra gráfica */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', fontFamily: 'var(--fuente-mono)' }}>
          <span>Cappuccino: <strong>{leche.tiempoCappuccino}</strong></span>
          <span style={{ color: 'var(--texto-suave)' }}>Latte: {leche.tiempoLatte}</span>
        </div>
        <div className="barra-aireado-contenedor" title={`Nivel de aireado: ${leche.barraAireado} de 6`}>
          <div className="barra-aireado-track">
            <div
              className="barra-aireado-fill"
              style={{
                width: `${(leche.barraAireado / 6) * 100}%`,
                backgroundColor: esVegetal ? 'var(--verde)' : 'var(--acento)',
              }}
            />
          </div>
          <span className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--texto-suave)' }}>
            {leche.barraAireado}/6
          </span>
        </div>
      </div>

      {/* Calidad de espuma en puntos geométricos discretos */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
        <span style={{ color: 'var(--texto-secundario)', fontSize: '0.82rem', textTransform: 'uppercase', fontFamily: 'var(--fuente-mono)', letterSpacing: '0.04em' }}>
          Densidad de Microespuma
        </span>
        <div style={{ display: 'flex', gap: '5px' }} aria-label={`${leche.calidadEspuma} de 5 puntos`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: i < leche.calidadEspuma ? (esVegetal ? 'var(--verde)' : 'var(--acento)') : 'var(--borde-fuerte)',
              }}
            />
          ))}
        </div>
      </div>

      {/* Textura */}
      <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--texto-principal)' }}>
        <strong style={{ color: 'var(--texto-secundario)' }}>Textura en taza:</strong> {leche.textura}
      </p>

      {/* Cómo usarla */}
      <div
        style={{
          backgroundColor: 'var(--bg-superficie)',
          padding: '10px 12px',
          borderRadius: 'var(--radio-sm)',
          border: '1px solid var(--borde)',
          fontSize: '0.88rem',
        }}
      >
        <span className="mono" style={{ color: esVegetal ? 'var(--verde)' : 'var(--acento)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
          Técnica de vaporizado
        </span>
        {leche.como}
      </div>

      {/* Recuadro de precaución en barra */}
      <div
        className="tarjeta-roja"
        style={{
          padding: '10px 12px',
          borderRadius: 'var(--radio-sm)',
          fontSize: '0.86rem',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
        }}
      >
        <div style={{ marginTop: '1px' }}>
          <IconoAlerta size={15} color="var(--rojo)" />
        </div>
        <div>
          <strong style={{ color: 'var(--rojo)', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', fontFamily: 'var(--fuente-mono)' }}>
            Precaución de Calidad:
          </strong>
          <span style={{ color: 'var(--texto-principal)' }}>{leche.ojo}</span>
        </div>
      </div>
    </div>
  );
};
