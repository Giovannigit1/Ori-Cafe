import React from 'react';
import { IconoTermometro } from './Iconos';

interface TermometroProps {
  vegetalMin?: number;
  vegetalMax?: number;
  vacaMin?: number;
  vacaMax?: number;
  quemadoMin?: number;
}

export const Termometro: React.FC<TermometroProps> = ({
  vegetalMin = 55,
  vegetalMax = 60,
  vacaMin = 60,
  vacaMax = 65,
  quemadoMin = 70,
}) => {
  const minEscala = 40;
  const maxEscala = 75;
  const rangoTotal = maxEscala - minEscala; // 35 grados

  const calcularPorcentaje = (grados: number) => {
    const clamped = Math.max(minEscala, Math.min(maxEscala, grados));
    return ((clamped - minEscala) / rangoTotal) * 100;
  };

  const pFriaEnd = calcularPorcentaje(vegetalMin);
  const pVegetalEnd = calcularPorcentaje(vegetalMax);
  const pVacaEnd = calcularPorcentaje(vacaMax);
  const pQuemadoStart = calcularPorcentaje(quemadoMin);

  const wFria = pFriaEnd;
  const wVegetal = pVegetalEnd - pFriaEnd;
  const wVaca = pVacaEnd - pVegetalEnd;
  const wTransicion = pQuemadoStart - pVacaEnd;
  const wQuema = 100 - pQuemadoStart;

  return (
    <div className="termometro-contenedor" role="region" aria-label="Escala de temperatura para texturizado">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <IconoTermometro size={16} color="var(--acento)" />
          <span className="badge badge-gris">ESCALA TÉRMICA DE CONTROL</span>
        </div>
        <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--texto-suave)' }}>
          40 °C — 75 °C
        </span>
      </div>

      {/* Graduaciones analógicas */}
      <div className="termometro-graduaciones">
        <span>40°</span>
        <span>50°</span>
        <span style={{ color: 'var(--verde)', fontWeight: 700 }}>55°</span>
        <span style={{ color: 'var(--acento)', fontWeight: 700 }}>60°</span>
        <span>65°</span>
        <span style={{ color: 'var(--rojo)', fontWeight: 700 }}>70°</span>
        <span>75°</span>
      </div>

      <div className="termometro-barra" title="Escala térmica calibrada de vaporizado">
        {/* Fría */}
        <div className="termometro-zona zona-fria" style={{ width: `${wFria}%` }}>
          <span>40–{vegetalMin}°</span>
        </div>

        {/* Vegetal */}
        <div className="termometro-zona zona-vegetal" style={{ width: `${wVegetal}%` }}>
          <span>VEG {vegetalMin}–{vegetalMax}°</span>
        </div>

        {/* Vaca */}
        <div className="termometro-zona zona-vaca" style={{ width: `${wVaca}%` }}>
          <span>VACA {vacaMin}–{vacaMax}°</span>
        </div>

        {/* Transición */}
        {wTransicion > 0 && (
          <div className="termometro-zona" style={{ width: `${wTransicion}%`, backgroundColor: '#8E6738' }}>
            <span>65–{quemadoMin}°</span>
          </div>
        )}

        {/* Quema */}
        <div className="termometro-zona zona-quema" style={{ width: `${wQuema}%` }}>
          <span>&gt;{quemadoMin}°</span>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--bg-superficie-suave)', border: '1px solid var(--borde)', padding: '10px 12px', borderRadius: 'var(--radio-sm)', marginTop: '4px' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--texto-secundario)', margin: 0 }}>
          <strong style={{ color: 'var(--texto-principal)' }}>Control táctil en barra:</strong> afirma la base metálica del pitcher con la palma; cuando esté caliente y ya casi no puedas sostenerla cómodamente, estás en la zona de ~60 °C.
        </p>
      </div>
    </div>
  );
};
