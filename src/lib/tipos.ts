export type TipoModulo =
  | 'ficha_tecnica'
  | 'tecnica_selector'
  | 'calibracion'
  | 'protocolo'
  | 'lectura';

export interface ParametrosReceta {
  dosisGramos: number; // 18 g (en el portafiltro)
  rendimientoGramos: number; // 21 g (en la taza)
  tiempoSegundos: number; // 25 s
  ratio?: string; // ej. "1:1,17"
  temperaturaLeche?: string; // ej. "60 °C" o "60–65 °C"
  volumenLeche?: string; // ej. "180 ml"
  taza?: string; // ej. "300 ml"
  espuma?: string; // ej. "1 cm" o "1,5 a 2 cm"
  pitcher?: string; // ej. "350 ml" o "600 ml"
  notaDiferencia?: string; // Explicación para no confundir 18g y 21g
}

export interface PasoModulo {
  id: string;
  orden: number;
  titulo: string;
  descripcion: string;
  consejo?: string;
  enlaceTexto?: string;
  enlaceDestino?: string;
  fraseEjemplo?: string; // Para protocolo de atención: qué decir en grande
  mostrarSelectorLeche?: boolean;
  mostrarDiagnostico?: boolean;
  mostrarTermometro?: boolean;
}

export interface PreguntaQuiz {
  id: string;
  pregunta: string;
  opciones: string[];
  indiceCorrecto: number;
  explicacion?: string;
}

export interface SintomaCalibracion {
  id: string;
  sintoma: string;
  sabor: string;
  tiempoAprox: string;
  posicionGrafico: number; // 0 (muy agrio/rápido) a 100 (muy amargo/lento), 50 equilibrado
  ajuste: string;
  aQueSabe: string;
  queSeVe: string;
  porQuePasa: string;
  queHacer: string;
}

export interface TipoLeche {
  id: string;
  nombre: string;
  grupo: 'vaca' | 'vegetal';
  temperatura: string;
  tiempoLatte: string;
  tiempoCappuccino: string;
  barraAireado: number; // 1 a 6
  calidadEspuma: number; // 1 a 5
  textura: string;
  como: string;
  ojo: string;
}

export interface MarcaVegetalRecomendada {
  id: string;
  nombre: string;
  base: string;
  uso: string;
  porQue: string;
  comoUsarla: string;
}

export interface ProblemaSolucionLeche {
  problema: string;
  solucion: string;
}

export interface FilaComparativaLeche {
  tipo: string;
  proteinas: string;
  grasa: string;
  estabilidad: string;
  comentario: string;
}

export interface HorarioCalibracion {
  id: string;
  nombre: string; // Apertura, Mediodía, Tarde
  hora: string; // "08:30", "12:30", "16:30"
}

export interface ControlCalidad {
  espresso?: string;
  leche?: string;
  espuma?: string;
  taza?: string;
}

export interface ModuloCapacitacion {
  id: string;
  orden: number;
  tipo: TipoModulo;
  titulo: string;
  descripcionCorta: string;
  introduccionDestacada?: string;
  proposito?: string;
  parametros?: ParametrosReceta;
  controlCalidad?: ControlCalidad;
  pasos: PasoModulo[];
  reglasOro?: string[];
  motivosRecalibracion?: string[];
  sintomasCalibracion?: SintomaCalibracion[];
  horariosCalibracion?: HorarioCalibracion[];
  leches?: TipoLeche[];
  marcasRecomendadas?: MarcaVegetalRecomendada[];
  consejosArteLatte?: string[];
  problemasSoluciones?: ProblemaSolucionLeche[];
  detallesDiferenciadores?: string[];
  filasComparativa?: FilaComparativaLeche[];
  quiz: PreguntaQuiz[];
}

export interface ContenidoAplicacion {
  version: string;
  tituloSitio: string;
  lema: string;
  subtitulo: string;
  horariosCalibracionPredeterminados: HorarioCalibracion[];
  modulos: ModuloCapacitacion[];
}

export interface ProgresoModulo {
  completado: boolean;
  fechaCompletado?: string;
  puntajeQuiz?: number;
  totalPreguntasQuiz?: number;
}

export interface ProgresoBarista {
  modulos: Record<string, ProgresoModulo>;
}

export interface RegistroCalibracion {
  fecha: string; // YYYY-MM-DD
  turnoId: string; // apertura | mediodia | tarde
  horaRegistrada: string; // HH:MM
}
