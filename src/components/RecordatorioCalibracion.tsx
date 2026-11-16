import React, { useState, useEffect } from 'react';
import { HorarioCalibracion, RegistroCalibracion } from '../lib/tipos';
import { obtenerCalibracionesHoy, registrarCalibracionTurno } from '../lib/progreso';
import { navegarA } from '../lib/router';
import { IconoCalibracion, IconoCheck } from './Iconos';

interface RecordatorioCalibracionProps {
  horarios: HorarioCalibracion[];
  enModuloCalibracion?: boolean;
}

export const RecordatorioCalibracion: React.FC<RecordatorioCalibracionProps> = ({
  horarios,
  enModuloCalibracion = false,
}) => {
  const [calibraciones, setCalibraciones] = useState<RegistroCalibracion[]>(() =>
    obtenerCalibracionesHoy()
  );
  const [minutoActual, setMinutoActual] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMinutoActual((prev) => prev + 1);
      setCalibraciones(obtenerCalibracionesHoy());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const ahora = new Date();
  const minutosDiaActual = ahora.getHours() * 60 + ahora.getMinutes();

  const convertirHorarioAMinutos = (horaStr: string) => {
    const [h, m] = horaStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  let turnoUrgentePendiente: HorarioCalibracion | null = null;
  let proximoTurno: HorarioCalibracion | null = null;

  for (const h of horarios) {
    const minutosTurno = convertirHorarioAMinutos(h.hora);
    const yaRegistrado = calibraciones.some((c) => c.turnoId === h.id);

    if (minutosDiaActual >= minutosTurno && !yaRegistrado) {
      turnoUrgentePendiente = h;
    } else if (minutosDiaActual < minutosTurno && !proximoTurno) {
      proximoTurno = h;
    }
  }

  useEffect(() => {
    if (turnoUrgentePendiente) {
      document.title = `Calibrar ahora | Ori Café`;
    } else {
      document.title = `Ori Café — Manual de Barra y Capacitación`;
    }
  }, [turnoUrgentePendiente, minutoActual]);

  const handleMarcarRealizada = (turnoId: string) => {
    const actualizadas = registrarCalibracionTurno(turnoId);
    setCalibraciones(actualizadas);
  };

  const todasCompletadas =
    horarios.length > 0 &&
    horarios.every((h) => calibraciones.some((c) => c.turnoId === h.id));

  return (
    <div
      className={`recordatorio-alerta ${
        turnoUrgentePendiente ? 'tarjeta-aviso' : todasCompletadas ? 'tarjeta-verde' : 'tarjeta'
      }`}
      role="region"
      aria-label="Estado de calibración de espresso del día"
    >
      <div className="recordatorio-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
          <div style={{ padding: '6px', backgroundColor: 'var(--bg-superficie)', borderRadius: '4px', border: '1px solid var(--borde)' }}>
            <IconoCalibracion size={20} color="var(--acento)" />
          </div>
          <div>
            <span className="badge badge-gris" style={{ marginBottom: '4px' }}>
              CALIBRACIÓN DEL DÍA
            </span>
            <h3 style={{ fontSize: '1.08rem', marginTop: '2px' }}>
              {turnoUrgentePendiente ? (
                <span style={{ color: 'var(--rojo)' }}>
                  Toca calibrar: {turnoUrgentePendiente.nombre.toLowerCase()} ({turnoUrgentePendiente.hora})
                </span>
              ) : todasCompletadas ? (
                <span style={{ color: 'var(--verde)' }}>Calibraciones de hoy al día</span>
              ) : proximoTurno ? (
                <span>
                  Próxima calibración: {proximoTurno.nombre.toLowerCase()} ({proximoTurno.hora})
                </span>
              ) : (
                <span>Calibraciones del día completadas</span>
              )}
            </h3>
          </div>
        </div>
      </div>

      {turnoUrgentePendiente && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '2px' }}>
          {!enModuloCalibracion && (
            <button
              type="button"
              className="btn btn-primario btn-sm"
              onClick={() => navegarA('#/practica/calibracion-espresso')}
            >
              Calibrar ahora (Práctica)
            </button>
          )}
          <button
            type="button"
            className="btn btn-secundario btn-sm"
            onClick={() => handleMarcarRealizada(turnoUrgentePendiente!.id)}
          >
            <IconoCheck size={14} /> Ya la hice
          </button>
        </div>
      )}

      {/* Chips con los horarios del día */}
      <div className="recordatorio-chips-horario" style={{ marginTop: '4px' }}>
        {horarios.map((h) => {
          const registro = calibraciones.find((c) => c.turnoId === h.id);
          const yaPaso = minutosDiaActual >= convertirHorarioAMinutos(h.hora);

          let estadoClase = '';
          if (registro) {
            estadoClase = 'realizado';
          } else if (yaPaso) {
            estadoClase = 'pendiente-urgente';
          }

          return (
            <div key={h.id} className={`chip-horario ${estadoClase}`}>
              <span>{h.nombre}</span>
              <span className="mono" style={{ opacity: 0.85 }}>[{h.hora}]</span>
              {registro ? (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: 'var(--verde)', fontWeight: 700 }}>
                  <IconoCheck size={13} /> {registro.horaRegistrada}
                </span>
              ) : yaPaso ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarcarRealizada(h.id);
                  }}
                  style={{ textDecoration: 'underline', fontWeight: 700, fontSize: '0.78rem', color: 'var(--acento)' }}
                >
                  Registrar
                </button>
              ) : (
                <span className="mono" style={{ fontSize: '0.72rem', opacity: 0.5 }}>PENDIENTE</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
