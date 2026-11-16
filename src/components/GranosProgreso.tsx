import React from 'react';

interface GranosProgresoProps {
  completados: number;
  total: number;
}

export const GranosProgreso: React.FC<GranosProgresoProps> = ({ completados, total }) => {
  const porcentaje = Math.round((completados / Math.max(total, 1)) * 100);

  return (
    <div className="tarjeta tarjeta-destacada" style={{ margin: '14px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div>
          <span className="badge badge-acento" style={{ marginBottom: '4px' }}>
            REGISTRO DE FORMACIÓN
          </span>
          <h2 style={{ fontSize: '1.25rem', marginTop: '4px' }}>
            {completados} de {total} módulos completados
          </h2>
        </div>
        <span className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: completados === total ? 'var(--verde)' : 'var(--acento)' }}>
          {porcentaje}%
        </span>
      </div>

      <div className="granos-contenedor" role="img" aria-label={`Progreso del barista: ${completados} de ${total} granos completados`}>
        {Array.from({ length: total }).map((_, i) => {
          const estaCompleto = i < completados;
          return (
            <div key={i} className="grano-item" title={`Módulo 0${i + 1}: ${estaCompleto ? 'Completado' : 'Pendiente'}`}>
              <svg
                className={`grano-svg ${estaCompleto ? 'completado' : ''}`}
                viewBox="0 0 32 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Silueta del grano de café artesanal */}
                <path
                  d="M16 4C23.5 4 28 10 28 18C28 26 23.5 32 16 32C8.5 32 4 26 4 18C4 10 8.5 4 16 4Z"
                  fill={estaCompleto ? 'var(--acento)' : 'var(--bg-superficie)'}
                  stroke={estaCompleto ? 'var(--acento-hover)' : 'var(--borde-fuerte)'}
                  strokeWidth="1.8"
                />
                {/* Hendidura en S clásica de tueste */}
                <path
                  d="M16 7C14 13 18 23 16 29"
                  stroke={estaCompleto ? '#FFFFFF' : 'var(--texto-suave)'}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              <span className="mono" style={{ fontSize: '0.68rem', color: estaCompleto ? 'var(--acento)' : 'var(--texto-suave)', fontWeight: 700 }}>
                0{i + 1}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
