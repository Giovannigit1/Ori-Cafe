import React from 'react';
import { ModuloCapacitacion } from '../lib/tipos';
import { navegarA } from '../lib/router';
import { IlustracionPitcher } from '../components/IlustracionPitcher';
import { Termometro } from '../components/Termometro';
import { SelectorLeche } from '../components/SelectorLeche';
import { DiagnosticoSabor } from '../components/DiagnosticoSabor';
import { RecordatorioCalibracion } from '../components/RecordatorioCalibracion';
import { IconoFlechaIzquierda, IconoFlechaDerecha, IconoTaza, IconoAlerta } from '../components/Iconos';

interface VistaModuloProps {
  modulo: ModuloCapacitacion;
}

export const VistaModulo: React.FC<VistaModuloProps> = ({ modulo }) => {
  return (
    <article style={{ display: 'flex', flexDirection: 'column', gap: '22px', paddingBottom: '90px' }}>
      {/* Navegación de retorno */}
      <div>
        <button
          type="button"
          className="btn btn-secundario btn-sm"
          onClick={() => navegarA('#/')}
          aria-label="Volver al menú principal"
        >
          <IconoFlechaIzquierda size={14} /> Volver a Módulos
        </button>
      </div>

      {/* Encabezado del Módulo */}
      <header>
        <span className="badge badge-acento">ESTÁNDAR ORI CAFÉ • MÓDULO 0{modulo.orden}</span>
        <h1 style={{ fontSize: '2rem', marginTop: '6px', letterSpacing: '-0.025em' }}>{modulo.titulo}</h1>
        <p style={{ fontSize: '1.02rem', color: 'var(--texto-secundario)', marginTop: '4px' }}>
          {modulo.descripcionCorta}
        </p>
      </header>

      {/* Introducción Destacada */}
      {modulo.introduccionDestacada && (
        <div className="tarjeta tarjeta-destacada">
          <p className="editorial" style={{ fontSize: '1.15rem', fontStyle: 'italic', color: 'var(--texto-principal)', margin: 0, lineHeight: 1.4 }}>
            "{modulo.introduccionDestacada}"
          </p>
        </div>
      )}

      {/* Propósito de Atención */}
      {modulo.proposito && (
        <div className="frase-protocolo-gigante">
          "{modulo.proposito}"
        </div>
      )}

      {/* DATO CLAVE EN TODAS LAS FICHAS DE ESPRESSO (LABORATORY SPEC SHEET) */}
      {modulo.parametros && (
        <section className="ficha-laboratorio" aria-label="Especificaciones estandarizadas de extracción">
          <div className="ficha-laboratorio-header">
            <span className="badge badge-acento">ESPECIFICACIÓN DE RECETA (IN / OUT)</span>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--texto-suave)', textTransform: 'uppercase' }}>
              CALIBRACIÓN OFICIAL
            </span>
          </div>

          <div className="ficha-laboratorio-body">
            {/* GRID CRÍTICO DE EXTRACCIÓN */}
            <div className="especificacion-espresso-grid">
              <div className="bloque-metrica-espresso dosis-in">
                <span className="metrica-tag-tecnica">Dosis In [Portafiltro]</span>
                <div className="metrica-cifra-grande">
                  {modulo.parametros.dosisGramos}.0 g
                </div>
                <p className="metrica-explicacion">
                  Café molido seco pesado en la balanza.
                </p>
              </div>

              <div className="bloque-metrica-espresso rendimiento-out">
                <span className="metrica-tag-tecnica">Rendimiento Out [Taza]</span>
                <div className="metrica-cifra-grande" style={{ color: 'var(--verde)' }}>
                  {modulo.parametros.rendimientoGramos}.0 g
                </div>
                <p className="metrica-explicacion">
                  Espresso líquido extraído en taza.
                </p>
              </div>

              <div className="bloque-metrica-espresso tiempo-ext">
                <span className="metrica-tag-tecnica">Tiempo Extracción</span>
                <div className="metrica-cifra-grande">
                  {modulo.parametros.tiempoSegundos} s
                </div>
                <p className="metrica-explicacion">
                  Desde pulsar hasta corte en 21 g.
                </p>
              </div>
            </div>

            {/* Chips con parámetros complementarios */}
            <div className="chips-parametros" style={{ margin: '8px 0 0 0' }}>
              {modulo.parametros.ratio && (
                <span className="chip-parametro">
                  Ratio: <strong>{modulo.parametros.ratio}</strong>
                </span>
              )}
              {modulo.parametros.taza && (
                <span className="chip-parametro">
                  Taza: <strong>{modulo.parametros.taza}</strong>
                </span>
              )}
              {modulo.parametros.volumenLeche && (
                <span className="chip-parametro">
                  Volumen leche: <strong>{modulo.parametros.volumenLeche}</strong>
                </span>
              )}
              {modulo.parametros.pitcher && (
                <span className="chip-parametro">
                  Pitcher: <strong>{modulo.parametros.pitcher}</strong>
                </span>
              )}
              {modulo.parametros.temperaturaLeche && (
                <span className="chip-parametro">
                  Temp. objetivo: <strong>{modulo.parametros.temperaturaLeche}</strong>
                </span>
              )}
              {modulo.parametros.espuma && (
                <span className="chip-parametro">
                  Espuma: <strong>{modulo.parametros.espuma}</strong>
                </span>
              )}
            </div>
          </div>
        </section>
      )}

      {/* COMPONENTES ESPECIALES: TEXTURIZADO DE LECHE */}
      {modulo.tipo === 'tecnica_selector' && (
        <>
          {/* Fases con Ilustraciones Vectoriales */}
          <section aria-labelledby="titulo-fases">
            <h2 id="titulo-fases" style={{ fontSize: '1.3rem' }}>
              Las 2 Fases del Vaporizado
            </h2>
            <div className="fases-pitcher-grid">
              <div className="tarjeta tarjeta-destacada">
                <span className="badge badge-acento">FASE 01</span>
                <h3 style={{ marginTop: '6px' }}>Airear: Incorporación de Espuma</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)' }}>
                  Punta justo en la superficie, sonido continuo de rasgado suave. Solo en los primeros segundos mientras la leche está fría.
                </p>
                <IlustracionPitcher fase="airear" />
              </div>

              <div className="tarjeta tarjeta-verde">
                <span className="badge badge-verde">FASE 02</span>
                <h3 style={{ marginTop: '6px' }}>Integrar: Remolino y Textura Sedosa</h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)' }}>
                  Punta sumergida 1 cm, la leche gira en un vórtice continuo hasta alcanzar temperatura. Se cierra la perilla antes de retirar.
                </p>
                <IlustracionPitcher fase="integrar" />
              </div>
            </div>
          </section>

          {/* Termómetro Horizontal Calibrado */}
          <section>
            <Termometro />
          </section>

          {/* Selector de Leches: Cada leche es distinta */}
          {modulo.leches && (
            <section aria-labelledby="titulo-leches">
              <h2 id="titulo-leches" style={{ fontSize: '1.3rem' }}>
                Comportamiento por Tipo de Leche
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                Diferencias técnicas de vaporizado, tiempos de aireado y precauciones para lácteos vacunos y vegetales.
              </p>
              <SelectorLeche leches={modulo.leches} />
            </section>
          )}

          {/* Marcas Vegetales Recomendadas */}
          {modulo.marcasRecomendadas && (
            <section aria-labelledby="titulo-marcas">
              <h2 id="titulo-marcas" style={{ fontSize: '1.3rem' }}>
                Fórmulas Barista Recomendadas para Arte Latte
              </h2>
              <p style={{ fontSize: '0.92rem', color: 'var(--texto-secundario)', marginBottom: '14px' }}>
                Para dibujar arte latte con bebida vegetal, <strong>utiliza siempre la fórmula Barista</strong>. La versión tradicional carece de lípidos y estabilizantes necesarios para retener el contraste del vertido.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {modulo.marcasRecomendadas.map((marca) => (
                  <div key={marca.id} className="tarjeta tarjeta-verde" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="badge badge-verde">VERSIÓN BARISTA</span>
                      <span className="mono" style={{ fontSize: '0.74rem', color: 'var(--verde)', fontWeight: 700 }}>{marca.base}</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: 'var(--texto-principal)' }}>{marca.nombre}</h3>
                    <div className="mono" style={{ fontSize: '0.78rem', color: 'var(--verde)', fontWeight: 700 }}>
                      Uso recomendado: {marca.uso}
                    </div>
                    <p style={{ fontSize: '0.88rem', color: 'var(--texto-secundario)', margin: 0 }}>
                      <strong>Propiedad:</strong> {marca.porQue}
                    </p>
                    <div style={{ backgroundColor: 'var(--bg-superficie)', padding: '8px 10px', borderRadius: 'var(--radio-sm)', fontSize: '0.84rem', border: '1px solid var(--borde)' }}>
                      <strong>Protocolo:</strong> {marca.comoUsarla}
                    </div>
                  </div>
                ))}
              </div>

              {/* Consejos para que salga el dibujo */}
              {modulo.consejosArteLatte && (
                <div className="tarjeta" style={{ marginTop: '14px' }}>
                  <h3 style={{ fontSize: '1.05rem', color: 'var(--acento-fuerte)', marginBottom: '8px' }}>
                    Recomendaciones de Taller para Vertido:
                  </h3>
                  <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                    {modulo.consejosArteLatte.map((c, idx) => (
                      <li key={idx} style={{ marginBottom: '6px' }}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Si pasa esto, haz esto */}
          {modulo.problemasSoluciones && (
            <section aria-labelledby="titulo-problemas">
              <h2 id="titulo-problemas" style={{ fontSize: '1.3rem' }}>
                Resolución de Anomalías en Barra
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                {modulo.problemasSoluciones.map((item, idx) => (
                  <div key={idx} className="tarjeta" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ color: 'var(--rojo)', fontWeight: 700, fontSize: '0.92rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <IconoAlerta size={14} color="var(--rojo)" /> {item.problema}
                    </div>
                    <div style={{ color: 'var(--texto-principal)', fontSize: '0.88rem', paddingLeft: '20px' }}>
                      <strong>Corrección técnica:</strong> {item.solucion}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {/* COMPONENTES ESPECIALES: CALIBRACIÓN */}
      {modulo.tipo === 'calibracion' && (
        <>
          {modulo.reglasOro && (
            <section className="tarjeta tarjeta-destacada">
              <span className="badge badge-acento" style={{ marginBottom: '6px' }}>CRITERIOS INNEGOCIABLES</span>
              <h3 style={{ fontSize: '1.15rem' }}>
                Reglas de Oro para Calibrar el Molino
              </h3>
              <ul style={{ paddingLeft: '18px', marginTop: '8px', fontSize: '0.92rem', color: 'var(--texto-secundario)' }}>
                {modulo.reglasOro.map((regla, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{regla}</li>
                ))}
              </ul>
            </section>
          )}

          {modulo.sintomasCalibracion && (
            <section>
              <DiagnosticoSabor sintomas={modulo.sintomasCalibracion} />
            </section>
          )}

          {modulo.motivosRecalibracion && (
            <section className="tarjeta">
              <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>
                Recalibración fuera de horario programado:
              </h3>
              <ul style={{ paddingLeft: '18px', fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
                {modulo.motivosRecalibracion.map((motivo, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{motivo}</li>
                ))}
              </ul>
            </section>
          )}

          {modulo.horariosCalibracion && (
            <section>
              <RecordatorioCalibracion horarios={modulo.horariosCalibracion} enModuloCalibracion={true} />
            </section>
          )}
        </>
      )}

      {/* COMPONENTES ESPECIALES: PROTOCOLO DE ATENCIÓN */}
      {modulo.tipo === 'protocolo' && modulo.detallesDiferenciadores && (
        <section className="tarjeta tarjeta-destacada">
          <span className="badge badge-acento" style={{ marginBottom: '6px' }}>HOSPITALIDAD CHILENA</span>
          <h3 style={{ fontSize: '1.15rem' }}>
            Detalles que nos distinguen en Santiago:
          </h3>
          <ul style={{ paddingLeft: '18px', marginTop: '8px', fontSize: '0.92rem', color: 'var(--texto-secundario)' }}>
            {modulo.detallesDiferenciadores.map((det, idx) => (
              <li key={idx} style={{ marginBottom: '8px' }}>{det}</li>
            ))}
          </ul>
        </section>
      )}

      {/* COMPONENTES ESPECIALES: QUÍMICA DE LA LECHE */}
      {modulo.tipo === 'lectura' && modulo.filasComparativa && (
        <section aria-labelledby="titulo-tabla-quimica">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <h2 id="titulo-tabla-quimica" style={{ fontSize: '1.3rem' }}>
              Física y Composición Química
            </h2>
            <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--texto-suave)' }}>
              MATRIZ COMPARATIVA
            </span>
          </div>

          <div className="tabla-scroll-wrapper">
            <table className="tabla-comparativa">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Proteínas Clave</th>
                  <th>Grasa</th>
                  <th>Estabilidad</th>
                  <th>Comentario Técnico</th>
                </tr>
              </thead>
              <tbody>
                {modulo.filasComparativa.map((fila, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 700, color: 'var(--texto-principal)' }}>{fila.tipo}</td>
                    <td className="mono" style={{ fontSize: '0.82rem' }}>{fila.proteinas}</td>
                    <td className="mono" style={{ fontSize: '0.82rem' }}>{fila.grasa}</td>
                    <td>
                      <span className={`badge ${fila.estabilidad.includes('Excelente') ? 'badge-verde' : 'badge-gris'}`}>
                        {fila.estabilidad}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--texto-secundario)' }}>{fila.comentario}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* PASOS DE LA TÉCNICA */}
      <section aria-labelledby="titulo-pasos-tecnica">
        <h2 id="titulo-pasos-tecnica" style={{ fontSize: '1.3rem', marginBottom: '12px' }}>
          {modulo.tipo === 'protocolo' ? 'Secuencia de Hospitalidad' : 'Protocolo de Ejecución'}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {modulo.pasos.map((paso) => (
            <div key={paso.id} className="tarjeta" style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div
                className="mono"
                style={{
                  minWidth: '32px',
                  height: '32px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--bg-superficie-suave)',
                  color: 'var(--acento)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: '1px solid var(--borde)',
                }}
              >
                0{paso.orden}
              </div>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <h3 style={{ fontSize: '1.1rem' }}>{paso.titulo}</h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--texto-principal)', margin: 0 }}>{paso.descripcion}</p>

                {paso.fraseEjemplo && (
                  <div className="frase-protocolo-gigante" style={{ margin: '8px 0', fontSize: '1.25rem', padding: '12px 14px' }}>
                    "{paso.fraseEjemplo}"
                  </div>
                )}

                {paso.consejo && (
                  <p style={{ fontSize: '0.85rem', color: 'var(--texto-suave)', margin: '4px 0 0 0' }}>
                    <strong style={{ color: 'var(--texto-secundario)' }}>Consejo:</strong> {paso.consejo}
                  </p>
                )}

                {paso.enlaceTexto && paso.enlaceDestino && (
                  <div style={{ marginTop: '4px' }}>
                    <a
                      href={paso.enlaceDestino}
                      style={{ fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      {paso.enlaceTexto} <IconoFlechaDerecha size={13} />
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Control de Calidad */}
      {modulo.controlCalidad && (
        <section className="tarjeta tarjeta-destacada">
          <span className="badge badge-acento" style={{ marginBottom: '6px' }}>ESTÁNDAR DE SALIDA</span>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>
            Control de Calidad al Servir
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
            {modulo.controlCalidad.espresso && (
              <div>
                <strong style={{ fontSize: '0.88rem' }}>Espresso:</strong>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}>{modulo.controlCalidad.espresso}</p>
              </div>
            )}
            {modulo.controlCalidad.leche && (
              <div>
                <strong style={{ fontSize: '0.88rem' }}>Leche:</strong>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}>{modulo.controlCalidad.leche}</p>
              </div>
            )}
            {modulo.controlCalidad.espuma && (
              <div>
                <strong style={{ fontSize: '0.88rem' }}>Espuma:</strong>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}>{modulo.controlCalidad.espuma}</p>
              </div>
            )}
            {modulo.controlCalidad.taza && (
              <div>
                <strong style={{ fontSize: '0.88rem' }}>Taza:</strong>
                <p style={{ fontSize: '0.85rem', margin: '2px 0 0 0' }}>{modulo.controlCalidad.taza}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Botón flotante inferior: Empezar Práctica Guiada */}
      <footer className="barra-inferior-fija">
        <div className="barra-inferior-inner">
          <button
            type="button"
            className="btn btn-secundario"
            onClick={() => navegarA('#/')}
          >
            <IconoFlechaIzquierda size={14} /> Volver
          </button>
          <button
            type="button"
            className="btn btn-primario btn-lg"
            style={{ width: 'auto', flex: 1 }}
            onClick={() => navegarA(`#/practica/${modulo.id}`)}
          >
            <IconoTaza size={16} /> Empezar Práctica Guiada
          </button>
        </div>
      </footer>
    </article>
  );
};
