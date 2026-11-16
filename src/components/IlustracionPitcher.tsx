import React from 'react';

interface IlustracionPitcherProps {
  fase: 'airear' | 'integrar';
}

export const IlustracionPitcher: React.FC<IlustracionPitcherProps> = ({ fase }) => {
  if (fase === 'airear') {
    return (
      <div className="pitcher-svg-box" aria-label="Diagrama técnico Fase 1: Inyección de aire en superficie">
        <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Rejilla de plano técnico tenue */}
          <line x1="20" y1="75" x2="220" y2="75" stroke="var(--borde)" strokeWidth="0.8" strokeDasharray="3 3" />
          <line x1="120" y1="15" x2="120" y2="135" stroke="var(--borde)" strokeWidth="0.8" strokeDasharray="3 3" />

          {/* Cuerpo del Pitcher */}
          <path
            d="M55 42 L70 128 C71 134 76 138 82 138 L148 138 C154 138 159 134 160 128 L175 42 Z"
            fill="var(--bg-superficie)"
            stroke="var(--texto-principal)"
            strokeWidth="2"
          />
          {/* Pico vertedor */}
          <path d="M55 42 L42 34 L62 42" stroke="var(--texto-principal)" strokeWidth="2" fill="none" />
          {/* Asa del pitcher */}
          <path
            d="M170 55 C196 60 200 106 163 120"
            stroke="var(--texto-principal)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Líquido frío base */}
          <path
            d="M66 84 L164 84 L160 128 C159 134 154 138 148 138 L82 138 C76 138 71 134 70 128 Z"
            fill="var(--acento-claro)"
          />
          {/* Línea de superficie con cota técnica */}
          <line x1="64" y1="84" x2="166" y2="84" stroke="var(--acento)" strokeWidth="2" strokeDasharray="4 3" />

          {/* Lanceta de Vapor en inclinación precisa de 15° */}
          <g transform="rotate(15 120 20)">
            <rect x="115" y="0" width="7" height="69" rx="2" fill="#717D88" stroke="#3D454C" strokeWidth="1.4" />
            <path d="M113 69 L118.5 78 L124 69 Z" fill="#2E343A" />
            <circle cx="118.5" cy="74" r="1.2" fill="#FFFFFF" />
          </g>

          {/* Burbujitas microscópicas de aire */}
          <g className="anim-burbuja-1">
            <circle cx="116" cy="92" r="2.8" fill="var(--acento)" opacity="0.8" />
            <circle cx="108" cy="98" r="2" fill="var(--acento)" opacity="0.6" />
          </g>
          <g className="anim-burbuja-2">
            <circle cx="126" cy="94" r="2.5" fill="var(--acento)" opacity="0.7" />
            <circle cx="134" cy="102" r="1.8" fill="var(--acento)" opacity="0.5" />
          </g>

          {/* Anotación de audio cue */}
          <g transform="translate(150, 48)">
            <rect x="0" y="0" width="76" height="20" rx="3" fill="var(--bg-superficie)" stroke="var(--acento)" strokeWidth="1" />
            <text x="38" y="14" fill="var(--acento)" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="var(--fuente-mono)">
              chss continuo
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Modo Integrar / Remolino
  return (
    <div className="pitcher-svg-box" aria-label="Diagrama técnico Fase 2: Remolino e integración térmica">
      <svg width="240" height="150" viewBox="0 0 240 150" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="20" y1="75" x2="220" y2="75" stroke="var(--borde)" strokeWidth="0.8" strokeDasharray="3 3" />
        <line x1="120" y1="15" x2="120" y2="135" stroke="var(--borde)" strokeWidth="0.8" strokeDasharray="3 3" />

        {/* Cuerpo del Pitcher */}
        <path
          d="M55 42 L70 128 C71 134 76 138 82 138 L148 138 C154 138 159 134 160 128 L175 42 Z"
          fill="var(--bg-superficie)"
          stroke="var(--texto-principal)"
          strokeWidth="2"
        />
        <path d="M55 42 L42 34 L62 42" stroke="var(--texto-principal)" strokeWidth="2" fill="none" />
        <path
          d="M170 55 C196 60 200 106 163 120"
          stroke="var(--texto-principal)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Leche emulsionada con volumen expandido */}
        <path
          d="M62 74 L168 74 L160 128 C159 134 154 138 148 138 L82 138 C76 138 71 134 70 128 Z"
          fill="var(--verde-claro)"
        />

        {/* Lanceta sumergida 1 cm */}
        <g transform="rotate(15 120 20)">
          <rect x="115" y="0" width="7" height="79" rx="2" fill="#717D88" stroke="#3D454C" strokeWidth="1.4" />
          <path d="M113 79 L118.5 88 L124 79 Z" fill="#2E343A" />
        </g>

        {/* Remolino técnico circular */}
        <g className="anim-remolino" style={{ transformOrigin: '115px 105px' }}>
          <ellipse cx="115" cy="105" rx="25" ry="13" stroke="var(--verde)" strokeWidth="2.2" strokeDasharray="14 6" fill="none" />
          <path d="M140 105 L136 99 L145 101 Z" fill="var(--verde)" />
          <path d="M90 105 L94 111 L85 109 Z" fill="var(--verde)" />
        </g>

        {/* Cota técnica de sumersión */}
        <g transform="translate(150, 48)">
          <rect x="0" y="0" width="76" height="20" rx="3" fill="var(--bg-superficie)" stroke="var(--verde)" strokeWidth="1" />
          <text x="38" y="14" fill="var(--verde)" fontSize="10.5" fontWeight="700" textAnchor="middle" fontFamily="var(--fuente-mono)">
            hunde 1 cm
          </text>
        </g>
      </svg>
    </div>
  );
};
