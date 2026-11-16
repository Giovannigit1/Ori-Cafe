import React, { useState } from 'react';
import { SintomaCalibracion } from '../lib/tipos';
import { IconoCalibracion } from './Iconos';

interface DiagnosticoSaborProps {
  sintomas: SintomaCalibracion[];
}

export const DiagnosticoSabor: React.FC<DiagnosticoSaborProps> = ({ sintomas }) => {
  const [sintomaSeleccionadoId, setSintomaSeleccionadoId] = useState<string>(
    sintomas[0]?.id || 'agrio'
  );

  const sintomaActual =
    sintomas.find((s) => s.id === sintomaSeleccionadoId) || sintomas[0];

  const posicion = sintomaActual ? sintomaActual.posicionGrafico : 50;

  return (
    <div className="diagnostico-contenedor" role="region" aria-label="Diagnóstico sensorial SCA de calibración">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <IconoCalibracion size={16} color="var(--acento)" />
          <span className="badge badge-acento">EVALUACIÓN SENSORIAL SCA</span>
        </div>
        <h3 style={{ fontSize: '1.3rem', marginTop: '4px' }}>Diagnóstico por Sabor en Taza</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
          Selecciona el perfil de sabor detectado al probar el espresso para calibrar el dial del molino o corregir la técnica.
        </p>
      </div>

      {/* Espectro Sensorial de Extracción */}
      <div>
        <div className="barra-sabor-escala" role="img" aria-label={`Espectro sensorial, cursor en ${posicion}%`}>
          <div
            className="marcador-sabor"
            style={{ left: `${posicion}%` }}
            title={`Ajuste: ${sintomaActual?.ajuste}`}
          >
            {posicion < 45 ? 'SUB' : posicion > 55 ? 'SOBRE' : 'OK'}
          </div>
        </div>
        <div className="escala-etiquetas">
          <span style={{ color: '#C07918' }}>← Sub-extracción (Acidez / Rápido)</span>
          <span style={{ color: 'var(--verde)' }}>Equilibrio (23–28 s)</span>
          <span style={{ color: '#4E3324' }}>Sobre-extracción (Amargor / Lento) →</span>
        </div>
      </div>

      {/* Botones de Síntomas Sensoriales */}
      <div className="botones-sintomas-grid">
        {sintomas.map((s) => {
          const esActivo = s.id === sintomaSeleccionadoId;
          return (
            <button
              key={s.id}
              type="button"
              className={`btn-sintoma ${esActivo ? 'activo' : ''}`}
              onClick={() => setSintomaSeleccionadoId(s.id)}
            >
              <div>{s.sintoma}</div>
              <div className="mono" style={{ fontSize: '0.74rem', opacity: 0.8, marginTop: '2px' }}>
                {s.tiempoAprox}
              </div>
            </button>
          );
        })}
      </div>

      {/* Ficha Técnica de Ajuste de Molino */}
      {sintomaActual && (
        <div
          className={`tarjeta ${
            sintomaActual.id === 'equilibrado'
              ? 'tarjeta-verde'
              : 'tarjeta-destacada'
          }`}
          style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          {/* Acción de Molino */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span className="badge badge-gris" style={{ marginBottom: '4px' }}>
                ACCIÓN DE CALIBRACIÓN
              </span>
              <h2
                style={{
                  fontSize: '1.45rem',
                  marginTop: '4px',
                  color:
                    sintomaActual.id === 'equilibrado'
                      ? 'var(--verde)'
                      : sintomaActual.id === 'canalizacion'
                      ? 'var(--rojo)'
                      : 'var(--acento)',
                }}
              >
                {sintomaActual.ajuste}
              </h2>
            </div>
            <span className="chip-parametro">
              Tiempo: <strong>{sintomaActual.tiempoAprox}</strong>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
            <div style={{ backgroundColor: 'var(--bg-superficie)', padding: '10px 14px', borderRadius: 'var(--radio-sm)', border: '1px solid var(--borde)' }}>
              <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--texto-suave)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Perfil en Paladar
              </span>
              <span style={{ fontSize: '0.94rem' }}>{sintomaActual.aQueSabe}</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-superficie)', padding: '10px 14px', borderRadius: 'var(--radio-sm)', border: '1px solid var(--borde)' }}>
              <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--texto-suave)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Diagnóstico Visual de Extracción
              </span>
              <span style={{ fontSize: '0.94rem' }}>{sintomaActual.queSeVe}</span>
            </div>

            <div style={{ backgroundColor: 'var(--bg-superficie)', padding: '10px 14px', borderRadius: 'var(--radio-sm)', border: '1px solid var(--borde)' }}>
              <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--texto-suave)', textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
                Causa Técnica
              </span>
              <span style={{ fontSize: '0.94rem' }}>{sintomaActual.porQuePasa}</span>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-superficie)',
                border: '1.5px solid var(--acento)',
                padding: '12px 14px',
                borderRadius: 'var(--radio-sm)',
              }}
            >
              <span className="mono" style={{ fontSize: '0.76rem', color: 'var(--acento-fuerte)', textTransform: 'uppercase', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Protocolo Inmediato en Barra
              </span>
              <span style={{ fontSize: '0.98rem', fontWeight: 600 }}>{sintomaActual.queHacer}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
