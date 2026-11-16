import React from 'react';
import { ContenidoAplicacion, ProgresoBarista } from '../lib/tipos';
import { GranosProgreso } from '../components/GranosProgreso';
import { RecordatorioCalibracion } from '../components/RecordatorioCalibracion';
import { navegarA } from '../lib/router';
import { reiniciarProgresoLocal } from '../lib/progreso';
import { IconoFlechaDerecha, IconoCheck, IconoTaza } from '../components/Iconos';

interface InicioProps {
  contenido: ContenidoAplicacion;
  progreso: ProgresoBarista;
  onActualizarProgreso: () => void;
  mostrarToast: (msj: string) => void;
}

export const Inicio: React.FC<InicioProps> = ({
  contenido,
  progreso,
  onActualizarProgreso,
  mostrarToast,
}) => {
  const modulos = contenido.modulos;
  const totalModulos = modulos.length;
  const completados = modulos.filter((m) => progreso.modulos[m.id]?.completado).length;

  const handleReiniciarProgreso = () => {
    const seguro = window.confirm(
      '¿Estás seguro de reiniciar tu progreso? Se borrarán los módulos completados y puntajes de este dispositivo.'
    );
    if (seguro) {
      reiniciarProgresoLocal();
      onActualizarProgreso();
      mostrarToast('Progreso reiniciado correctamente');
    }
  };

  const obtenerEtiquetaTipo = (tipo: string) => {
    switch (tipo) {
      case 'ficha_tecnica':
        return 'FICHA TÉCNICA';
      case 'tecnica_selector':
        return 'TÉCNICA DE VAPORIZADO';
      case 'calibracion':
        return 'CALIBRACIÓN DIARIA';
      case 'protocolo':
        return 'HOSPITALIDAD & ATENCIÓN';
      case 'lectura':
        return 'FÍSICA & QUÍMICA';
      default:
        return 'MÓDULO';
    }
  };

  return (
    <main style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '40px' }}>
      {/* Portada Editorial */}
      <section style={{ borderBottom: '1px solid var(--borde)', paddingBottom: '18px' }}>
        <span className="badge badge-acento" style={{ marginBottom: '6px' }}>
          MANUAL TÉCNICO DE BARRA
        </span>
        <h1 style={{ fontSize: '2.1rem', marginTop: '6px', color: 'var(--texto-principal)', letterSpacing: '-0.03em' }}>
          {contenido.lema}
        </h1>
        <p className="editorial" style={{ marginTop: '8px', fontSize: '1.12rem', color: 'var(--texto-secundario)', fontStyle: 'italic', lineHeight: 1.4 }}>
          {contenido.subtitulo}
        </p>
      </section>

      {/* Control Diario de Calibración */}
      <RecordatorioCalibracion
        horarios={contenido.horariosCalibracionPredeterminados}
      />

      {/* Seguimiento de Formación (Granos de Café) */}
      <GranosProgreso completados={completados} total={totalModulos} />

      {/* Módulos de Aprendizaje */}
      <section aria-labelledby="titulo-modulos">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '4px' }}>
          <h2 id="titulo-modulos" style={{ fontSize: '1.3rem' }}>
            Plan de Formación Práctica
          </h2>
          <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--texto-suave)', textTransform: 'uppercase' }}>
            06 MÓDULOS DE BARRA
          </span>
        </div>

        <div className="lista-modulos">
          {modulos.map((modulo, index) => {
            const estado = progreso.modulos[modulo.id];
            const estaCompletado = Boolean(estado?.completado);

            return (
              <div
                key={modulo.id}
                className="tarjeta tarjeta-modulo"
                onClick={() => navegarA(`#/modulo/${modulo.id}`)}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') navegarA(`#/modulo/${modulo.id}`);
                }}
                style={{ cursor: 'pointer' }}
                aria-label={`Módulo ${index + 1}: ${modulo.titulo}. Estado: ${
                  estaCompletado ? 'Completado' : 'Pendiente'
                }`}
              >
                <div className="modulo-meta">
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span className="mono" style={{ fontWeight: 700, color: 'var(--acento)', fontSize: '0.98rem' }}>
                      0{index + 1}
                    </span>
                    <span className="badge badge-gris">
                      {obtenerEtiquetaTipo(modulo.tipo)}
                    </span>
                  </div>

                  {estaCompletado ? (
                    <span className="badge badge-verde" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <IconoCheck size={12} /> APROBADO {estado?.puntajeQuiz !== undefined ? `(${estado.puntajeQuiz}/${estado.totalPreguntasQuiz || 5})` : ''}
                    </span>
                  ) : (
                    <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', fontWeight: 700 }}>
                      PENDIENTE
                    </span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--texto-principal)' }}>
                    {modulo.titulo}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: 'var(--texto-secundario)', marginTop: '4px' }}>
                    {modulo.descripcionCorta}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', paddingTop: '10px', borderTop: '1px solid var(--borde-suave)' }}>
                  <span style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--acento)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Revisar estándar <IconoFlechaDerecha size={14} />
                  </span>
                  <button
                    type="button"
                    className="btn btn-secundario btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navegarA(`#/practica/${modulo.id}`);
                    }}
                    aria-label={`Ir directo a práctica guiada de ${modulo.titulo}`}
                  >
                    <IconoTaza size={13} /> Práctica Guiada
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Enlace para reiniciar progreso */}
      <footer style={{ marginTop: '16px', textAlign: 'center', borderTop: '1px solid var(--borde)', paddingTop: '16px' }}>
        <button
          type="button"
          onClick={handleReiniciarProgreso}
          style={{
            fontSize: '0.84rem',
            color: 'var(--texto-suave)',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontFamily: 'var(--fuente-mono)',
          }}
        >
          Reiniciar mi progreso en este dispositivo
        </button>
      </footer>
    </main>
  );
};
