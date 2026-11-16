import { ProgresoBarista, ProgresoModulo, RegistroCalibracion } from './tipos';

const CLAVE_PROGRESO = 'ori_cafe_progreso_v1';
const CLAVE_CALIBRACIONES = 'ori_cafe_calibraciones_v1';

export function obtenerProgresoLocal(): ProgresoBarista {
  try {
    const raw = localStorage.getItem(CLAVE_PROGRESO);
    if (!raw) return { modulos: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.modulos === 'object' ? parsed : { modulos: {} };
  } catch (err) {
    console.warn('No se pudo leer el progreso de localStorage:', err);
    return { modulos: {} };
  }
}

export function guardarProgresoModulo(
  moduloId: string,
  datos: Partial<ProgresoModulo>
): ProgresoBarista {
  try {
    const actual = obtenerProgresoLocal();
    const previo = actual.modulos[moduloId] || { completado: false };
    const actualizado: ProgresoModulo = {
      ...previo,
      ...datos,
      completado: datos.completado ?? previo.completado,
      fechaCompletado: datos.fechaCompletado ?? (datos.completado ? new Date().toISOString() : previo.fechaCompletado)
    };

    actual.modulos[moduloId] = actualizado;
    localStorage.setItem(CLAVE_PROGRESO, JSON.stringify(actual));
    return actual;
  } catch (err) {
    console.warn('No se pudo guardar el progreso:', err);
    return { modulos: {} };
  }
}

export function reiniciarProgresoLocal(): void {
  try {
    localStorage.removeItem(CLAVE_PROGRESO);
  } catch (err) {
    console.warn('Error al reiniciar progreso:', err);
  }
}

export function obtenerCalibracionesHoy(): RegistroCalibracion[] {
  try {
    const hoyStr = new Date().toISOString().split('T')[0];
    const raw = localStorage.getItem(CLAVE_CALIBRACIONES);
    if (!raw) return [];
    const lista: RegistroCalibracion[] = JSON.parse(raw);
    return Array.isArray(lista) ? lista.filter(item => item.fecha === hoyStr) : [];
  } catch (err) {
    console.warn('No se pudieron leer las calibraciones:', err);
    return [];
  }
}

export function registrarCalibracionTurno(turnoId: string): RegistroCalibracion[] {
  try {
    const ahora = new Date();
    const hoyStr = ahora.toISOString().split('T')[0];
    const horaStr = ahora.toTimeString().substring(0, 5); // "HH:MM"

    const raw = localStorage.getItem(CLAVE_CALIBRACIONES);
    let lista: RegistroCalibracion[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(lista)) lista = [];

    // Filtrar si ya existía para el mismo turno de hoy y reemplazar
    lista = lista.filter(item => !(item.fecha === hoyStr && item.turnoId === turnoId));
    lista.push({
      fecha: hoyStr,
      turnoId,
      horaRegistrada: horaStr
    });

    localStorage.setItem(CLAVE_CALIBRACIONES, JSON.stringify(lista));
    return lista.filter(item => item.fecha === hoyStr);
  } catch (err) {
    console.warn('No se pudo registrar la calibración:', err);
    return [];
  }
}
