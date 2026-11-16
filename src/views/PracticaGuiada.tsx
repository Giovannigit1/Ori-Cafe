import React, { useState } from 'react';
import { ModuloCapacitacion } from '../lib/tipos';
import { navegarA } from '../lib/router';
import { TazaPasoCirculo } from '../components/TazaPasoCirculo';
import { SelectorLeche } from '../components/SelectorLeche';
import { DiagnosticoSabor } from '../components/DiagnosticoSabor';
import { Termometro } from '../components/Termometro';
import { registrarCalibracionTurno } from '../lib/progreso';
import { IconoCruz, IconoFlechaIzquierda, IconoFlechaDerecha, IconoPortafiltro, IconoTaza, IconoReloj, IconoCheck } from '../components/Iconos';

interface PracticaGuiadaProps {
  modulo: ModuloCapacitacion;
  mostrarToast: (msj: string) => void;
}

export const PracticaGuiada: React.FC<PracticaGuiadaProps> = ({ modulo, mostrarToast }) => {
  const [pasoIndex, setPasoIndex] = useState<number>(0);
  const pasos = modulo.pasos || [];
  const totalPasos = pasos.length;
  const pasoActual = pasos[pasoIndex];

  const handleAnterior = () => {
    if (pasoIndex > 0) {
      setPasoIndex(pasoIndex - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSiguiente = () => {
    if (pasoIndex < totalPasos - 1) {
      setPasoIndex(pasoIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      navegarA(`#/quiz/${modulo.id}`);
    }
  };

  const handleRegistrarCalibracionTurno = () => {
    const ahora = new Date();
    const hora = ahora.getHours();
    let turnoId = 'apertura';
    if (hora >= 11 && hora < 15) turnoId = 'mediodia';
    else if (hora >= 15) turnoId = 'tarde';

    registrarCalibracionTurno(turnoId);
    mostrarToast('Calibración registrada en el turno de hoy');
  };

  if (!pasoActual) {
    return (
      <div className="tarjeta" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>No hay pasos disponibles en este módulo.</h2>
        <button
          type="button"
          className="btn btn-primario"
          style={{ marginTop: '16px' }}
          onClick={() => navegarA(`#/modulo/${modulo.id}`)}
        >
          Volver a la ficha
        </button>
      </div>
    );
  }

  const porcentajeProgreso = ((pasoIndex + 1) / totalPasos) * 100;
  const esUltimoPaso = pasoIndex === totalPasos - 1;

  return (
    <article className="practica-pantalla" aria-label={`Práctica guiada: ${modulo.titulo}`}>
      {/* Barra de progreso superior y salida */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            type="button"
            className="btn btn-secundario btn-sm"
            onClick={() => navegarA(`#/modulo/${modulo.id}`)}
            aria-label="Salir de la práctica y volver a la ficha"
          >
            <IconoCruz size={13} /> Salir
          </button>
          <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--texto-suave)' }}>
            PASO 0{pasoIndex + 1} / 0{totalPasos}
          </span>
        </div>

        <div className="practica-progreso-barra" role="progressbar" aria-valuenow={porcentajeProgreso} aria-valuemin={0} aria-valuemax={100}>
          <div className="practica-progreso-fill" style={{ width: `${porcentajeProgreso}%` }} />
        </div>
      </div>

      {/* Cabecera del paso con Taza Analógica */}
      <div className="practica-header-paso">
        <TazaPasoCirculo pasoNumero={pasoIndex + 1} totalPasos={totalPasos} />
        <div>
          <span className="badge badge-acento">{modulo.titulo}</span>
          <h1 style={{ fontSize: '1.45rem', marginTop: '4px', letterSpacing: '-0.02em' }}>
            {pasoActual.titulo}
          </h1>
        </div>
      </div>

      {/* Chips con los parámetros clave de la receta */}
      {modulo.parametros && (
        <div className="chips-parametros" style={{ margin: '2px 0 8px 0' }}>
          <span className="chip-parametro" style={{ borderLeft: '3px solid var(--acento)' }}>
            <IconoPortafiltro size={14} color="var(--acento)" /> IN: <strong>{modulo.parametros.dosisGramos}.0 g</strong>
          </span>
          <span className="chip-parametro" style={{ borderLeft: '3px solid var(--verde)' }}>
            <IconoTaza size={14} color="var(--verde)" /> OUT: <strong>{modulo.parametros.rendimientoGramos}.0 g</strong>
          </span>
          <span className="chip-parametro">
            <IconoReloj size={14} /> <strong>{modulo.parametros.tiempoSegundos} s</strong>
          </span>
          {modulo.parametros.temperaturaLeche && (
            <span className="chip-parametro">
              Leche: <strong>{modulo.parametros.temperaturaLeche}</strong>
            </span>
          )}
        </div>
      )}

      {/* Instrucción del paso */}
      <div className="tarjeta tarjeta-destacada" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <p style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--texto-principal)', lineHeight: 1.45, margin: 0 }}>
          {pasoActual.descripcion}
        </p>

        {/* Frase para protocolo de atención */}
        {pasoActual.fraseEjemplo && (
          <div className="frase-protocolo-gigante">
            "{pasoActual.fraseEjemplo}"
          </div>
        )}

        {/* Consejo técnico */}
        {pasoActual.consejo && (
          <div
            style={{
              backgroundColor: 'var(--bg-superficie)',
              padding: '12px 14px',
              borderRadius: 'var(--radio-sm)',
              border: '1px solid var(--borde)',
            }}
          >
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--acento-fuerte)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '2px' }}>
              Recomendación de Barra:
            </span>
            <p style={{ fontSize: '0.92rem', color: 'var(--texto-secundario)', margin: 0 }}>
              {pasoActual.consejo}
            </p>
          </div>
        )}

        {pasoActual.enlaceTexto && pasoActual.enlaceDestino && (
          <div>
            <a href={pasoActual.enlaceDestino} style={{ fontSize: '0.88rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              {pasoActual.enlaceTexto} <IconoFlechaDerecha size={13} />
            </a>
          </div>
        )}
      </div>

      {/* Componentes interactivos embebidos en el paso */}
      {pasoActual.mostrarTermometro && (
        <div style={{ marginTop: '6px' }}>
          <Termometro />
        </div>
      )}

      {pasoActual.mostrarSelectorLeche && modulo.leches && (
        <div style={{ marginTop: '6px' }}>
          <span className="badge badge-verde" style={{ marginBottom: '6px' }}>CONFIGURACIÓN POR TIPO DE LECHE</span>
          <SelectorLeche leches={modulo.leches} soloInteractivoPequeno={true} />
        </div>
      )}

      {pasoActual.mostrarDiagnostico && modulo.sintomasCalibracion && (
        <div style={{ marginTop: '6px' }}>
          <DiagnosticoSabor sintomas={modulo.sintomasCalibracion} />
        </div>
      )}

      {/* Si es el último paso del módulo de lectura/química, mostrar la tabla */}
      {modulo.tipo === 'lectura' && esUltimoPaso && modulo.filasComparativa && (
        <div className="tabla-scroll-wrapper">
          <table className="tabla-comparativa">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Proteínas</th>
                <th>Grasa</th>
                <th>Estabilidad</th>
                <th>Comentario Técnico</th>
              </tr>
            </thead>
            <tbody>
              {modulo.filasComparativa.map((fila, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 700 }}>{fila.tipo}</td>
                  <td className="mono">{fila.proteinas}</td>
                  <td className="mono">{fila.grasa}</td>
                  <td>{fila.estabilidad}</td>
                  <td style={{ fontSize: '0.85rem' }}>{fila.comentario}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Si es calibración en el último paso: Botón para registrar calibración */}
      {modulo.tipo === 'calibracion' && esUltimoPaso && (
        <div className="tarjeta tarjeta-verde" style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', textAlign: 'center' }}>
          <span className="badge badge-verde">CONFIRMACIÓN DE TURNO</span>
          <h3 style={{ fontSize: '1.15rem' }}>¿El espresso quedó equilibrado en taza?</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)', margin: 0 }}>
            Registra la calibración de este turno en la app para el control del local.
          </p>
          <button
            type="button"
            className="btn btn-verde btn-lg"
            style={{ marginTop: '6px' }}
            onClick={handleRegistrarCalibracionTurno}
          >
            <IconoCheck size={16} /> Registrar Calibración
          </button>
        </div>
      )}

      {/* Barra de navegación inferior fija */}
      <footer className="barra-inferior-fija">
        <div className="barra-inferior-inner">
          <button
            type="button"
            className="btn btn-secundario"
            onClick={handleAnterior}
            disabled={pasoIndex === 0}
            style={{ opacity: pasoIndex === 0 ? 0.35 : 1 }}
          >
            <IconoFlechaIzquierda size={14} /> Anterior
          </button>

          <button
            type="button"
            className={`btn ${esUltimoPaso ? 'btn-verde' : 'btn-primario'} btn-lg`}
            style={{ flex: 1 }}
            onClick={handleSiguiente}
          >
            {esUltimoPaso ? (
              <>Ir al Quiz <IconoFlechaDerecha size={14} /></>
            ) : (
              <>Siguiente paso <IconoFlechaDerecha size={14} /></>
            )}
          </button>
        </div>
      </footer>
    </article>
  );
};
