import React, { useState } from 'react';
import {
  ContenidoAplicacion,
  ModuloCapacitacion,
  TipoModulo,
  PasoModulo,
  PreguntaQuiz,
} from '../lib/tipos';
import { navegarA } from '../lib/router';
import { almacen } from '../lib/almacen';
import { IconoFlechaIzquierda, IconoCheck, IconoCruz, IconoFlechaArriba, IconoFlechaAbajo, IconoBasura } from '../components/Iconos';

interface EditorProps {
  contenidoInicial: ContenidoAplicacion;
  onGuardarContenido: (nuevo: ContenidoAplicacion) => void;
  mostrarToast: (msj: string) => void;
}

export const Editor: React.FC<EditorProps> = ({
  contenidoInicial,
  onGuardarContenido,
  mostrarToast,
}) => {
  const [contenido, setContenido] = useState<ContenidoAplicacion>(() =>
    JSON.parse(JSON.stringify(contenidoInicial))
  );

  const [moduloSeleccionadoId, setModuloSeleccionadoId] = useState<string>(
    contenido.modulos[0]?.id || ''
  );

  const [mostrarModalNuevoModulo, setMostrarModalNuevoModulo] = useState<boolean>(false);
  const [nuevoTitulo, setNuevoTitulo] = useState<string>('');
  const [nuevaDescripcion, setNuevaDescripcion] = useState<string>('');
  const [nuevoTipo, setNuevoTipo] = useState<TipoModulo>('ficha_tecnica');

  const moduloActual = contenido.modulos.find((m) => m.id === moduloSeleccionadoId);

  const moverModulo = (indice: number, direccion: 'arriba' | 'abajo') => {
    const nuevosModulos = [...contenido.modulos];
    const destino = direccion === 'arriba' ? indice - 1 : indice + 1;
    if (destino < 0 || destino >= nuevosModulos.length) return;

    const temp = nuevosModulos[indice];
    nuevosModulos[indice] = nuevosModulos[destino];
    nuevosModulos[destino] = temp;

    nuevosModulos.forEach((m, idx) => {
      m.orden = idx + 1;
    });

    setContenido({ ...contenido, modulos: nuevosModulos });
    mostrarToast('Módulo reordenado');
  };

  const eliminarModulo = (id: string, titulo: string) => {
    const seguro = window.confirm(
      `¿Estás seguro de eliminar el módulo "${titulo}"? Esta acción no se puede deshacer.`
    );
    if (!seguro) return;

    const filtrados = contenido.modulos.filter((m) => m.id !== id);
    filtrados.forEach((m, idx) => {
      m.orden = idx + 1;
    });

    setContenido({ ...contenido, modulos: filtrados });
    if (moduloSeleccionadoId === id) {
      setModuloSeleccionadoId(filtrados[0]?.id || '');
    }
    mostrarToast(`Módulo "${titulo}" eliminado`);
  };

  const handleCrearModulo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const nuevoId = nuevoTitulo
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `modulo-${Date.now()}`;

    const nuevoMod: ModuloCapacitacion = {
      id: nuevoId,
      orden: contenido.modulos.length + 1,
      tipo: nuevoTipo,
      titulo: nuevoTitulo.trim(),
      descripcionCorta: nuevaDescripcion.trim() || 'Descripción del nuevo módulo.',
      pasos: [
        {
          id: `${nuevoId}-p1`,
          orden: 1,
          titulo: 'Primer paso de la técnica',
          descripcion: 'Explica con lenguaje claro y simple qué debe hacer el barista.',
          consejo: 'Añade un tip práctico aplicable detrás de la barra.',
        },
      ],
      quiz: [
        {
          id: `${nuevoId}-q1`,
          pregunta: `Pregunta clave sobre ${nuevoTitulo}`,
          opciones: ['Opción A', 'Opción B (Correcta)', 'Opción C'],
          indiceCorrecto: 1,
          explicacion: 'Explicación técnica de por qué esta es la respuesta adecuada.',
        },
      ],
    };

    if (nuevoTipo === 'ficha_tecnica') {
      nuevoMod.parametros = {
        dosisGramos: 18,
        rendimientoGramos: 21,
        tiempoSegundos: 25,
        ratio: '1:1,17',
        volumenLeche: '180 ml',
        temperaturaLeche: '60 °C',
        notaDiferencia: '18 g café molido en portafiltro → 21 g espresso en taza.',
      };
      nuevoMod.controlCalidad = {
        espresso: 'Crema avellana y uniforme.',
        leche: 'Microespuma brillante y sedosa.',
      };
    }

    const nuevos = [...contenido.modulos, nuevoMod];
    setContenido({ ...contenido, modulos: nuevos });
    setModuloSeleccionadoId(nuevoId);
    setMostrarModalNuevoModulo(false);
    setNuevoTitulo('');
    setNuevaDescripcion('');
    mostrarToast(`Módulo "${nuevoTitulo}" creado`);
  };

  const actualizarModulo = (campo: keyof ModuloCapacitacion, valor: unknown) => {
    if (!moduloActual) return;
    const actualizados = contenido.modulos.map((m) =>
      m.id === moduloActual.id ? { ...m, [campo]: valor } : m
    );
    setContenido({ ...contenido, modulos: actualizados });
  };

  const actualizarParametros = (campo: string, valor: unknown) => {
    if (!moduloActual || !moduloActual.parametros) return;
    const nuevosParametros = { ...moduloActual.parametros, [campo]: valor };
    actualizarModulo('parametros', nuevosParametros);
  };

  const agregarPaso = () => {
    if (!moduloActual) return;
    const pasosActuales = moduloActual.pasos || [];
    const nuevoPaso: PasoModulo = {
      id: `${moduloActual.id}-p${pasosActuales.length + 1}-${Date.now()}`,
      orden: pasosActuales.length + 1,
      titulo: 'Nuevo paso',
      descripcion: 'Detalle de la instrucción para el barista.',
      consejo: 'Consejo práctico detrás de la barra.',
    };
    actualizarModulo('pasos', [...pasosActuales, nuevoPaso]);
    mostrarToast('Paso agregado');
  };

  const actualizarPaso = (pasoId: string, campo: keyof PasoModulo, valor: unknown) => {
    if (!moduloActual) return;
    const nuevosPasos = moduloActual.pasos.map((p) =>
      p.id === pasoId ? { ...p, [campo]: valor } : p
    );
    actualizarModulo('pasos', nuevosPasos);
  };

  const moverPaso = (indice: number, direccion: 'arriba' | 'abajo') => {
    if (!moduloActual) return;
    const pasos = [...moduloActual.pasos];
    const destino = direccion === 'arriba' ? indice - 1 : indice + 1;
    if (destino < 0 || destino >= pasos.length) return;

    const temp = pasos[indice];
    pasos[indice] = pasos[destino];
    pasos[destino] = temp;

    pasos.forEach((p, idx) => {
      p.orden = idx + 1;
    });

    actualizarModulo('pasos', pasos);
  };

  const eliminarPaso = (pasoId: string) => {
    if (!moduloActual) return;
    if (moduloActual.pasos.length <= 1) {
      alert('El módulo debe tener al menos un paso.');
      return;
    }
    const seguro = window.confirm('¿Eliminar este paso?');
    if (!seguro) return;

    const filtrados = moduloActual.pasos.filter((p) => p.id !== pasoId);
    filtrados.forEach((p, idx) => {
      p.orden = idx + 1;
    });
    actualizarModulo('pasos', filtrados);
    mostrarToast('Paso eliminado');
  };

  const agregarPregunta = () => {
    if (!moduloActual) return;
    const quizActual = moduloActual.quiz || [];
    const nuevaP: PreguntaQuiz = {
      id: `${moduloActual.id}-q${quizActual.length + 1}-${Date.now()}`,
      pregunta: 'Nueva pregunta de evaluación',
      opciones: ['Opción 1', 'Opción 2', 'Opción 3'],
      indiceCorrecto: 0,
      explicacion: 'Por qué esta opción es la correcta.',
    };
    actualizarModulo('quiz', [...quizActual, nuevaP]);
    mostrarToast('Pregunta agregada');
  };

  const actualizarPregunta = (pId: string, campo: keyof PreguntaQuiz, valor: unknown) => {
    if (!moduloActual) return;
    const nuevoQuiz = moduloActual.quiz.map((q) =>
      q.id === pId ? { ...q, [campo]: valor } : q
    );
    actualizarModulo('quiz', nuevoQuiz);
  };

  const actualizarOpcionPregunta = (pId: string, indiceOpcion: number, nuevoTexto: string) => {
    if (!moduloActual) return;
    const nuevoQuiz = moduloActual.quiz.map((q) => {
      if (q.id === pId) {
        const nuevasOpciones = [...q.opciones];
        nuevasOpciones[indiceOpcion] = nuevoTexto;
        return { ...q, opciones: nuevasOpciones };
      }
      return q;
    });
    actualizarModulo('quiz', nuevoQuiz);
  };

  const eliminarPregunta = (pId: string) => {
    if (!moduloActual) return;
    if (moduloActual.quiz.length <= 1) {
      alert('El quiz debe tener al menos una pregunta.');
      return;
    }
    const seguro = window.confirm('¿Eliminar esta pregunta?');
    if (!seguro) return;

    const filtrado = moduloActual.quiz.filter((q) => q.id !== pId);
    actualizarModulo('quiz', filtrado);
    mostrarToast('Pregunta eliminada');
  };

  const handleGuardarCambios = async () => {
    try {
      await almacen.guardarContenido(contenido);
      onGuardarContenido(contenido);
      mostrarToast('Cambios guardados con éxito en la plataforma');
    } catch (err) {
      console.error(err);
      alert('Error al guardar los cambios.');
    }
  };

  const handleDescartar = () => {
    const seguro = window.confirm('¿Descartar todos los cambios no guardados?');
    if (seguro) {
      setContenido(JSON.parse(JSON.stringify(contenidoInicial)));
      mostrarToast('Cambios descartados');
    }
  };

  const handleExportarJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(contenido, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ori-cafe-contenido-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    mostrarToast('Contenido exportado en archivo JSON');
  };

  const handleImportarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const texto = event.target?.result as string;
        const nuevoContenido = await almacen.importarJSON(texto);
        setContenido(nuevoContenido);
        onGuardarContenido(nuevoContenido);
        setModuloSeleccionadoId(nuevoContenido.modulos[0]?.id || '');
        mostrarToast('Contenido importado y actualizado');
      } catch (err) {
        alert('El archivo no tiene un formato válido de Ori Café.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleRestablecerOriginal = async () => {
    const seguro = window.confirm(
      '¿Restablecer todo el contenido a los textos originales de Ori Café? Se perderán las modificaciones locales.'
    );
    if (seguro) {
      const original = await almacen.restablecer();
      setContenido(original);
      onGuardarContenido(original);
      setModuloSeleccionadoId(original.modulos[0]?.id || '');
      mostrarToast('Contenido restablecido al original');
    }
  };

  return (
    <div className="editor-formulario" role="main" aria-label="Editor de contenidos para el encargado">
      {/* Retorno */}
      <div>
        <button
          type="button"
          className="btn btn-secundario btn-sm"
          onClick={() => navegarA('#/')}
        >
          <IconoFlechaIzquierda size={14} /> Volver a Barra
        </button>
      </div>

      {/* Encabezado */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span className="badge badge-acento">ADMINISTRACIÓN DE BARRA</span>
          <h1 style={{ fontSize: '1.75rem', marginTop: '4px' }}>Editor de Contenidos</h1>
          <p style={{ fontSize: '0.9rem', color: 'var(--texto-secundario)' }}>
            Modifica parámetros técnicos, recetas, textos y evaluaciones. Los cambios se conservan localmente.
          </p>
        </div>

        {/* Acciones de Respaldo */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secundario btn-sm"
            onClick={handleExportarJSON}
            title="Descargar copia del contenido en formato JSON"
          >
            Exportar JSON
          </button>

          <label className="btn btn-secundario btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
            Importar JSON
            <input
              type="file"
              accept=".json"
              onChange={handleImportarJSON}
              style={{ display: 'none' }}
            />
          </label>

          <button
            type="button"
            className="btn btn-secundario btn-sm"
            onClick={handleRestablecerOriginal}
            title="Volver a los contenidos predeterminados"
          >
            Restablecer Fábrica
          </button>
        </div>
      </div>

      {/* Lista de Módulos */}
      <section className="tarjeta" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <h2 style={{ fontSize: '1.2rem' }}>Módulos en Formación ({contenido.modulos.length})</h2>
          <button
            type="button"
            className="btn btn-verde btn-sm"
            onClick={() => setMostrarModalNuevoModulo(true)}
          >
            + Crear Nuevo Módulo
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {contenido.modulos.map((m, idx) => {
            const esSeleccionado = m.id === moduloSeleccionadoId;
            return (
              <div
                key={m.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: 'var(--radio-sm)',
                  backgroundColor: esSeleccionado ? 'var(--acento-claro)' : 'var(--bg-superficie-suave)',
                  border: `1px solid ${esSeleccionado ? 'var(--acento)' : 'var(--borde)'}`,
                  gap: '8px',
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flex: 1 }}
                  onClick={() => setModuloSeleccionadoId(m.id)}
                >
                  <span className="mono" style={{ fontWeight: 700, color: 'var(--acento)' }}>
                    0{idx + 1}
                  </span>
                  <div>
                    <strong style={{ fontSize: '0.94rem' }}>{m.titulo}</strong>
                    <span className="badge badge-gris" style={{ marginLeft: '8px', fontSize: '0.68rem' }}>
                      {m.tipo}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className="btn btn-secundario btn-sm"
                    style={{ minHeight: '32px', padding: '4px 8px' }}
                    onClick={() => moverModulo(idx, 'arriba')}
                    disabled={idx === 0}
                    title="Mover arriba"
                  >
                    <IconoFlechaArriba size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secundario btn-sm"
                    style={{ minHeight: '32px', padding: '4px 8px' }}
                    onClick={() => moverModulo(idx, 'abajo')}
                    disabled={idx === contenido.modulos.length - 1}
                    title="Mover abajo"
                  >
                    <IconoFlechaAbajo size={13} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-peligro btn-sm"
                    style={{ minHeight: '32px', padding: '4px 8px' }}
                    onClick={() => eliminarModulo(m.id, m.titulo)}
                    title="Eliminar módulo"
                  >
                    <IconoBasura size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Modal / Formulario Nuevo Módulo */}
      {mostrarModalNuevoModulo && (
        <section className="tarjeta tarjeta-destacada" style={{ border: '1.5px solid var(--verde)' }}>
          <h3 style={{ fontSize: '1.2rem' }}>Crear Módulo de Capacitación</h3>
          <form onSubmit={handleCrearModulo} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
            <div className="campo-grupo">
              <label>Tipo de Módulo:</label>
              <select
                className="select-control"
                value={nuevoTipo}
                onChange={(e) => setNuevoTipo(e.target.value as TipoModulo)}
              >
                <option value="ficha_tecnica">Ficha técnica (Espresso, Latte, etc.)</option>
                <option value="protocolo">Protocolo (Atención, Hospitalidad)</option>
                <option value="lectura">Lectura (Ciencia y Teoría)</option>
                <option value="calibracion">Calibración (Ajuste de molino y sabor)</option>
                <option value="tecnica_selector">Técnica con selector (Leches, vaporizado)</option>
              </select>
            </div>

            <div className="campo-grupo">
              <label>Título del Módulo:</label>
              <input
                type="text"
                className="input-control"
                placeholder="Ej. Flat White, Espresso Doble, etc."
                value={nuevoTitulo}
                onChange={(e) => setNuevoTitulo(e.target.value)}
                required
              />
            </div>

            <div className="campo-grupo">
              <label>Descripción Corta:</label>
              <textarea
                className="textarea-control"
                placeholder="Breve resumen del estándar para el barista..."
                value={nuevaDescripcion}
                onChange={(e) => setNuevaDescripcion(e.target.value)}
                rows={2}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
              <button
                type="button"
                className="btn btn-secundario"
                onClick={() => setMostrarModalNuevoModulo(false)}
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-verde">
                <IconoCheck size={14} /> Crear Módulo
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Editor Detallado */}
      {moduloActual ? (
        <section className="tarjeta" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ borderBottom: '1px solid var(--borde)', paddingBottom: '10px' }}>
            <span className="badge badge-acento">EDITANDO MÓDULO 0{moduloActual.orden}</span>
            <h2 style={{ fontSize: '1.4rem', marginTop: '4px' }}>{moduloActual.titulo}</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
            <div className="campo-grupo">
              <label>Título:</label>
              <input
                type="text"
                className="input-control"
                value={moduloActual.titulo}
                onChange={(e) => actualizarModulo('titulo', e.target.value)}
              />
            </div>

            <div className="campo-grupo">
              <label>Tipo:</label>
              <select
                className="select-control"
                value={moduloActual.tipo}
                onChange={(e) => actualizarModulo('tipo', e.target.value as TipoModulo)}
              >
                <option value="ficha_tecnica">Ficha técnica</option>
                <option value="protocolo">Protocolo</option>
                <option value="lectura">Lectura</option>
                <option value="calibracion">Calibración</option>
                <option value="tecnica_selector">Técnica con selector</option>
              </select>
            </div>
          </div>

          <div className="campo-grupo">
            <label>Descripción Corta:</label>
            <textarea
              className="textarea-control"
              value={moduloActual.descripcionCorta}
              onChange={(e) => actualizarModulo('descripcionCorta', e.target.value)}
              rows={2}
            />
          </div>

          {moduloActual.introduccionDestacada !== undefined && (
            <div className="campo-grupo">
              <label>Introducción Destacada:</label>
              <textarea
                className="textarea-control"
                value={moduloActual.introduccionDestacada}
                onChange={(e) => actualizarModulo('introduccionDestacada', e.target.value)}
                rows={2}
              />
            </div>
          )}

          {moduloActual.proposito !== undefined && (
            <div className="campo-grupo">
              <label>Propósito Emocional / Frase de Atención:</label>
              <textarea
                className="textarea-control"
                value={moduloActual.proposito}
                onChange={(e) => actualizarModulo('proposito', e.target.value)}
                rows={2}
              />
            </div>
          )}

          {/* PARÁMETROS DE RECETA */}
          {moduloActual.parametros && (
            <div className="tarjeta tarjeta-destacada">
              <h3 style={{ fontSize: '1.1rem', color: 'var(--acento-fuerte)', marginBottom: '8px' }}>
                Parámetros de Extracción (18 g In vs 21 g Out)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                <div className="campo-grupo">
                  <label>Dosis In (portafiltro, g):</label>
                  <input
                    type="number"
                    className="input-control mono"
                    value={moduloActual.parametros.dosisGramos}
                    onChange={(e) => actualizarParametros('dosisGramos', Number(e.target.value))}
                  />
                </div>

                <div className="campo-grupo">
                  <label>Rendimiento Out (taza, g):</label>
                  <input
                    type="number"
                    className="input-control mono"
                    value={moduloActual.parametros.rendimientoGramos}
                    onChange={(e) => actualizarParametros('rendimientoGramos', Number(e.target.value))}
                  />
                </div>

                <div className="campo-grupo">
                  <label>Tiempo Extracción (s):</label>
                  <input
                    type="number"
                    className="input-control mono"
                    value={moduloActual.parametros.tiempoSegundos}
                    onChange={(e) => actualizarParametros('tiempoSegundos', Number(e.target.value))}
                  />
                </div>

                <div className="campo-grupo">
                  <label>Temperatura Leche:</label>
                  <input
                    type="text"
                    className="input-control mono"
                    value={moduloActual.parametros.temperaturaLeche || ''}
                    onChange={(e) => actualizarParametros('temperaturaLeche', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label>Volumen Leche:</label>
                  <input
                    type="text"
                    className="input-control mono"
                    value={moduloActual.parametros.volumenLeche || ''}
                    onChange={(e) => actualizarParametros('volumenLeche', e.target.value)}
                  />
                </div>

                <div className="campo-grupo">
                  <label>Espuma:</label>
                  <input
                    type="text"
                    className="input-control mono"
                    value={moduloActual.parametros.espuma || ''}
                    onChange={(e) => actualizarParametros('espuma', e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* EDITOR DE PASOS */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Pasos de la Técnica ({moduloActual.pasos.length})</h3>
              <button type="button" className="btn btn-verde btn-sm" onClick={agregarPaso}>
                + Agregar Paso
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {moduloActual.pasos.map((paso, pIdx) => (
                <div
                  key={paso.id}
                  className="tarjeta"
                  style={{ backgroundColor: 'var(--bg-superficie-suave)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--acento)' }}>
                      PASO 0{pIdx + 1}
                    </span>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button
                        type="button"
                        className="btn btn-secundario btn-sm"
                        style={{ minHeight: '30px', padding: '2px 8px' }}
                        onClick={() => moverPaso(pIdx, 'arriba')}
                        disabled={pIdx === 0}
                      >
                        <IconoFlechaArriba size={12} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-secundario btn-sm"
                        style={{ minHeight: '30px', padding: '2px 8px' }}
                        onClick={() => moverPaso(pIdx, 'abajo')}
                        disabled={pIdx === moduloActual.pasos.length - 1}
                      >
                        <IconoFlechaAbajo size={12} />
                      </button>
                      <button
                        type="button"
                        className="btn btn-peligro btn-sm"
                        style={{ minHeight: '30px', padding: '2px 8px' }}
                        onClick={() => eliminarPaso(paso.id)}
                      >
                        <IconoBasura size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="campo-grupo">
                    <label>Título:</label>
                    <input
                      type="text"
                      className="input-control"
                      value={paso.titulo}
                      onChange={(e) => actualizarPaso(paso.id, 'titulo', e.target.value)}
                    />
                  </div>

                  <div className="campo-grupo">
                    <label>Descripción:</label>
                    <textarea
                      className="textarea-control"
                      value={paso.descripcion}
                      onChange={(e) => actualizarPaso(paso.id, 'descripcion', e.target.value)}
                      rows={2}
                    />
                  </div>

                  <div className="campo-grupo">
                    <label>Consejo del Barista:</label>
                    <input
                      type="text"
                      className="input-control"
                      value={paso.consejo || ''}
                      onChange={(e) => actualizarPaso(paso.id, 'consejo', e.target.value)}
                    />
                  </div>

                  {moduloActual.tipo === 'protocolo' && (
                    <div className="campo-grupo">
                      <label>Ejemplo de qué decir:</label>
                      <input
                        type="text"
                        className="input-control"
                        value={paso.fraseEjemplo || ''}
                        onChange={(e) => actualizarPaso(paso.id, 'fraseEjemplo', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* EDITOR DE QUIZ */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.2rem' }}>Preguntas del Quiz ({moduloActual.quiz.length})</h3>
              <button type="button" className="btn btn-verde btn-sm" onClick={agregarPregunta}>
                + Agregar Pregunta
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {moduloActual.quiz.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="tarjeta"
                  style={{ backgroundColor: 'var(--bg-superficie-suave)', display: 'flex', flexDirection: 'column', gap: '8px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--verde)' }}>
                      PREGUNTA 0{qIdx + 1}
                    </span>
                    <button
                      type="button"
                      className="btn btn-peligro btn-sm"
                      style={{ minHeight: '30px', padding: '2px 8px' }}
                      onClick={() => eliminarPregunta(q.id)}
                    >
                      <IconoBasura size={12} /> Eliminar
                    </button>
                  </div>

                  <div className="campo-grupo">
                    <label>Enunciado:</label>
                    <input
                      type="text"
                      className="input-control"
                      value={q.pregunta}
                      onChange={(e) => actualizarPregunta(q.id, 'pregunta', e.target.value)}
                    />
                  </div>

                  <div className="campo-grupo">
                    <label>Opciones y respuesta correcta:</label>
                    {q.opciones.map((opc, opcIdx) => (
                      <div key={opcIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <input
                          type="radio"
                          name={`correcta-${q.id}`}
                          checked={q.indiceCorrecto === opcIdx}
                          onChange={() => actualizarPregunta(q.id, 'indiceCorrecto', opcIdx)}
                          title="Marcar como respuesta correcta"
                        />
                        <input
                          type="text"
                          className="input-control"
                          value={opc}
                          onChange={(e) => actualizarOpcionPregunta(q.id, opcIdx, e.target.value)}
                        />
                        {q.indiceCorrecto === opcIdx && (
                          <span className="mono" style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--verde)' }}>
                            CORRECTA
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="campo-grupo">
                    <label>Explicación técnica:</label>
                    <input
                      type="text"
                      className="input-control"
                      value={q.explicacion || ''}
                      onChange={(e) => actualizarPregunta(q.id, 'explicacion', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* BARRA FIJA INFERIOR */}
      <footer className="barra-inferior-fija">
        <div className="barra-inferior-inner">
          <button
            type="button"
            className="btn btn-secundario"
            onClick={handleDescartar}
          >
            <IconoCruz size={14} /> Descartar
          </button>
          <button
            type="button"
            className="btn btn-verde btn-lg"
            style={{ flex: 1 }}
            onClick={handleGuardarCambios}
          >
            <IconoCheck size={16} /> Guardar Cambios en la Barra
          </button>
        </div>
      </footer>
    </div>
  );
};
