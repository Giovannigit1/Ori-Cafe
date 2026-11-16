import React from 'react';

interface TazaPasoCirculoProps {
  pasoNumero: number;
  totalPasos: number;
}

export const TazaPasoCirculo: React.FC<TazaPasoCirculoProps> = ({ pasoNumero, totalPasos }) => {
  const porcentaje = Math.min(100, Math.max(15, (pasoNumero / Math.max(1, totalPasos)) * 100));

  return (
    <div
      className="taza-circulo-contenedor"
      title={`Paso ${pasoNumero} de ${totalPasos}`}
      role="img"
      aria-label={`Taza de café llena al ${Math.round(porcentaje)}%, indicando el paso ${pasoNumero} de ${totalPasos}`}
    >
      {/* Nivel de café líquido subiendo */}
      <div
        className="taza-circulo-liquido"
        style={{ height: `${porcentaje}%` }}
      />
      {/* Asa de taza pequeña en SVG o estilo circular */}
      <span className="taza-circulo-numero">
        {pasoNumero}
      </span>
    </div>
  );
};
