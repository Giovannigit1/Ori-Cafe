import React, { useState } from 'react';
import { ModuloCapacitacion } from '../lib/tipos';
import { navegarA } from '../lib/router';
import { guardarProgresoModulo } from '../lib/progreso';
import { IconoCheck, IconoCruz, IconoFlechaDerecha } from '../components/Iconos';

interface QuizProps {
  modulo: ModuloCapacitacion;
  onCompletarModulo: () => void;
  mostrarToast: (msj: string) => void;
}

export const Quiz: React.FC<QuizProps> = ({ modulo, onCompletarModulo, mostrarToast }) => {
  const preguntas = modulo.quiz || [];
  const totalPreguntas = preguntas.length;

  const [indicePregunta, setIndicePregunta] = useState<number>(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);
  const [respondido, setRespondido] = useState<boolean>(false);
  const [aciertos, setAciertos] = useState<number>(0);
  const [quizFinalizado, setQuizFinalizado] = useState<boolean>(false);

  const preguntaActual = preguntas[indicePregunta];

  const handleSeleccionarOpcion = (indice: number) => {
    if (respondido) return;

    setOpcionSeleccionada(indice);
    setRespondido(true);

    const esCorrecta = indice === preguntaActual.indiceCorrecto;
    if (esCorrecta) {
      setAciertos((prev) => prev + 1);
    }
  };

  const handleSiguientePregunta = () => {
    if (indicePregunta < totalPreguntas - 1) {
      setIndicePregunta(indicePregunta + 1);
      setOpcionSeleccionada(null);
      setRespondido(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const puntajeFinal = aciertos + (opcionSeleccionada === preguntaActual.indiceCorrecto ? 0 : 0);
      guardarProgresoModulo(modulo.id, {
        completado: true,
        puntajeQuiz: puntajeFinal,
        totalPreguntasQuiz: totalPreguntas,
      });
      onCompletarModulo();
      setQuizFinalizado(true);
      mostrarToast(`Módulo "${modulo.titulo}" completado`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReiniciarQuiz = () => {
    setIndicePregunta(0);
    setOpcionSeleccionada(null);
    setRespondido(false);
    setAciertos(0);
    setQuizFinalizado(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!preguntaActual && !quizFinalizado) {
    return (
      <div className="tarjeta" style={{ textAlign: 'center', padding: '40px' }}>
        <h2>Este módulo no tiene preguntas configuradas.</h2>
        <button
          type="button"
          className="btn btn-primario"
          style={{ marginTop: '16px' }}
          onClick={() => navegarA('#/')}
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  // Pantalla de Resultados
  if (quizFinalizado) {
    const porcentaje = Math.round((aciertos / totalPreguntas) * 100);
    const aproboBien = aciertos >= Math.ceil(totalPreguntas * 0.7);

    return (
      <div className="tarjeta tarjeta-destacada" style={{ textAlign: 'center', padding: '36px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'inline-flex', alignSelf: 'center' }}>
          <span className="badge badge-verde">EVALUACIÓN REGISTRADA</span>
        </div>

        <h1 style={{ fontSize: '1.9rem', letterSpacing: '-0.025em' }}>
          {aproboBien ? 'Estándar de Barra Aprobado' : 'Módulo Finalizado'}
        </h1>

        <div className="mono" style={{ fontSize: '2.5rem', fontWeight: 700, color: aproboBien ? 'var(--verde)' : 'var(--acento)' }}>
          {aciertos} / {totalPreguntas}
        </div>

        <p style={{ fontSize: '0.98rem', color: 'var(--texto-secundario)', maxWidth: '440px', margin: '0 auto' }}>
          Rendimiento en evaluación: <strong>{porcentaje}%</strong>. {aproboBien
            ? 'Demostraste dominio de los parámetros técnicos y de servicio de Ori Café. Tu avance ha quedado registrado en este equipo.'
            : 'Completaste la prueba. Te recomendamos repasar los parámetros técnicos de receta para que cada taza mantenga la consistencia requerida.'}
        </p>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '14px' }}>
          <button
            type="button"
            className="btn btn-secundario"
            onClick={handleReiniciarQuiz}
          >
            Reintentar Quiz
          </button>
          <button
            type="button"
            className="btn btn-primario"
            onClick={() => navegarA('#/')}
          >
            Volver a la Lista de Módulos
          </button>
        </div>
      </div>
    );
  }

  const esCorrectaSeleccionada = respondido && opcionSeleccionada === preguntaActual.indiceCorrecto;
  const esUltimaPregunta = indicePregunta === totalPreguntas - 1;
  const letrasOpciones = ['A', 'B', 'C', 'D'];

  return (
    <article className="quiz-pantalla" aria-label={`Evaluación: ${modulo.titulo}`}>
      {/* Encabezado del Quiz */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          type="button"
          className="btn btn-secundario btn-sm"
          onClick={() => navegarA(`#/modulo/${modulo.id}`)}
          aria-label="Volver a la ficha del módulo"
        >
          <IconoCruz size={13} /> Salir del Quiz
        </button>
        <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--texto-suave)' }}>
          PREGUNTA 0{indicePregunta + 1} / 0{totalPreguntas}
        </span>
      </div>

      {/* Pregunta en grande */}
      <div className="tarjeta" style={{ marginTop: '4px' }}>
        <span className="badge badge-acento">{modulo.titulo}</span>
        <h2 style={{ fontSize: '1.35rem', marginTop: '8px', lineHeight: 1.35, letterSpacing: '-0.02em' }}>
          {preguntaActual.pregunta}
        </h2>
      </div>

      {/* Lista de Opciones */}
      <div className="quiz-opciones-lista" role="radiogroup" aria-label="Opciones de respuesta">
        {preguntaActual.opciones.map((opcion, idx) => {
          let claseOpcion = '';
          const esEstaSeleccionada = opcionSeleccionada === idx;
          const esLaCorrecta = idx === preguntaActual.indiceCorrecto;

          if (respondido) {
            if (esLaCorrecta) {
              claseOpcion = 'correcta';
            } else if (esEstaSeleccionada) {
              claseOpcion = 'incorrecta';
            }
          }

          return (
            <button
              key={idx}
              type="button"
              className={`btn-opcion-quiz ${claseOpcion}`}
              onClick={() => handleSeleccionarOpcion(idx)}
              disabled={respondido}
              role="radio"
              aria-checked={esEstaSeleccionada}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="opcion-indice-circulo">
                  {letrasOpciones[idx] || idx + 1}
                </span>
                <span>{opcion}</span>
              </div>
              {respondido && (
                <div>
                  {esLaCorrecta ? (
                    <IconoCheck size={18} color="var(--verde)" />
                  ) : esEstaSeleccionada ? (
                    <IconoCruz size={18} color="var(--rojo)" />
                  ) : null}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Explicación y feedback inmediato */}
      {respondido && (
        <div
          className={`tarjeta ${esCorrectaSeleccionada ? 'tarjeta-verde' : 'tarjeta-roja'}`}
          style={{ animation: 'aparecerToast 0.2s ease', display: 'flex', flexDirection: 'column', gap: '6px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {esCorrectaSeleccionada ? (
              <IconoCheck size={18} color="var(--verde)" />
            ) : (
              <IconoCruz size={18} color="var(--rojo)" />
            )}
            <strong style={{ fontSize: '1rem', color: esCorrectaSeleccionada ? 'var(--verde)' : 'var(--rojo)' }}>
              {esCorrectaSeleccionada ? 'Respuesta correcta' : 'Respuesta incorrecta'}
            </strong>
          </div>
          {preguntaActual.explicacion && (
            <p style={{ fontSize: '0.92rem', color: 'var(--texto-principal)', margin: 0, paddingLeft: '26px' }}>
              {preguntaActual.explicacion}
            </p>
          )}
        </div>
      )}

      {/* Botón de Siguiente Pregunta */}
      <div style={{ marginTop: '12px' }}>
        <button
          type="button"
          className="btn btn-primario btn-lg"
          onClick={handleSiguientePregunta}
          disabled={!respondido}
          style={{ width: '100%', opacity: !respondido ? 0.4 : 1 }}
        >
          {esUltimaPregunta ? (
            <>Ver Resultados Finales <IconoFlechaDerecha size={14} /></>
          ) : (
            <>Siguiente Pregunta <IconoFlechaDerecha size={14} /></>
          )}
        </button>
      </div>
    </article>
  );
};
