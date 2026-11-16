import React, { useState } from 'react';
import { TipoLeche } from '../lib/tipos';
import { TarjetaLeche } from './TarjetaLeche';

interface SelectorLecheProps {
  leches: TipoLeche[];
  soloInteractivoPequeno?: boolean;
}

export const SelectorLeche: React.FC<SelectorLecheProps> = ({
  leches,
  soloInteractivoPequeno = false,
}) => {
  const [grupoActivo, setGrupoActivo] = useState<'vaca' | 'vegetal'>('vaca');
  const [lecheSeleccionadaId, setLecheSeleccionadaId] = useState<string>(
    leches.find((l) => l.grupo === 'vaca')?.id || leches[0]?.id || ''
  );

  const filtradas = leches.filter((l) => l.grupo === grupoActivo);
  const lecheActual = leches.find((l) => l.id === lecheSeleccionadaId) || filtradas[0];

  return (
    <div style={{ margin: '16px 0' }}>
      {/* Selector de pestañas */}
      <div className="tabs-leches" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={grupoActivo === 'vaca'}
          className={`tab-btn ${grupoActivo === 'vaca' ? 'activo' : ''}`}
          onClick={() => {
            setGrupoActivo('vaca');
            const primeraVaca = leches.find((l) => l.grupo === 'vaca');
            if (primeraVaca) setLecheSeleccionadaId(primeraVaca.id);
          }}
        >
          🥛 Leche de Vaca
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={grupoActivo === 'vegetal'}
          className={`tab-btn ${grupoActivo === 'vegetal' ? 'activo-vegetal' : ''}`}
          onClick={() => {
            setGrupoActivo('vegetal');
            const primeraVegetal = leches.find((l) => l.grupo === 'vegetal');
            if (primeraVegetal) setLecheSeleccionadaId(primeraVegetal.id);
          }}
        >
          🌱 Leches Vegetales
        </button>
      </div>

      {/* Botones de selección rápida entre tipos */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {filtradas.map((l) => (
          <button
            key={l.id}
            type="button"
            className={`btn btn-sm ${
              lecheSeleccionadaId === l.id
                ? grupoActivo === 'vegetal'
                  ? 'btn-verde'
                  : 'btn-primario'
                : 'btn-secundario'
            }`}
            onClick={() => setLecheSeleccionadaId(l.id)}
          >
            {l.nombre}
          </button>
        ))}
      </div>

      {/* Vista interactiva: si es vista pequeña o paso de práctica, muestra la seleccionada */}
      {soloInteractivoPequeno && lecheActual ? (
        <TarjetaLeche leche={lecheActual} />
      ) : (
        /* Vista en grilla con las leches del grupo activo */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filtradas.map((leche) => (
            <TarjetaLeche key={leche.id} leche={leche} />
          ))}
        </div>
      )}
    </div>
  );
};
