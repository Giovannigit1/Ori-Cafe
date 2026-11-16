import React, { useState, useEffect } from 'react';
import { useHashRouter } from './lib/router';
import { ContenidoAplicacion, ProgresoBarista } from './lib/tipos';
import { almacen } from './lib/almacen';
import { obtenerProgresoLocal } from './lib/progreso';
import { Cabecera } from './components/Cabecera';
import { Toast } from './components/Toast';
import { Inicio } from './views/Inicio';
import { VistaModulo } from './views/VistaModulo';
import { PracticaGuiada } from './views/PracticaGuiada';
import { Quiz } from './views/Quiz';
import { Editor } from './views/Editor';
import contenidoPredeterminado from './data/contenido.json';

export const App: React.FC = () => {
  const ruta = useHashRouter();

  const [contenido, setContenido] = useState<ContenidoAplicacion>(
    () => contenidoPredeterminado as unknown as ContenidoAplicacion
  );
  const [progreso, setProgreso] = useState<ProgresoBarista>(() => obtenerProgresoLocal());
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  // Cargar contenido persistente de localStorage o base
  useEffect(() => {
    almacen.cargarContenido().then((datos) => {
      if (datos) setContenido(datos);
    });
  }, []);

  const mostrarToast = (mensaje: string) => {
    setMensajeToast(mensaje);
    setTimeout(() => {
      setMensajeToast((actual) => (actual === mensaje ? null : actual));
    }, 3200);
  };

  const handleActualizarProgreso = () => {
    setProgreso(obtenerProgresoLocal());
  };

  const handleGuardarNuevoContenido = (nuevo: ContenidoAplicacion) => {
    setContenido(nuevo);
  };

  // Encontrar módulo según la ruta actual
  const moduloActual = ruta.id
    ? contenido.modulos.find((m) => m.id === ruta.id)
    : undefined;

  const esModoEditor = ruta.tipo === 'editar';

  return (
    <div className="app-contenedor">
      <Cabecera esModoEditor={esModoEditor} />

      {/* Ruteador de Vistas */}
      {ruta.tipo === 'inicio' && (
        <Inicio
          contenido={contenido}
          progreso={progreso}
          onActualizarProgreso={handleActualizarProgreso}
          mostrarToast={mostrarToast}
        />
      )}

      {ruta.tipo === 'modulo' && (
        moduloActual ? (
          <VistaModulo modulo={moduloActual} />
        ) : (
          <div className="tarjeta" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Módulo no encontrado</h2>
            <p style={{ marginTop: '8px' }}>El módulo que buscas no existe o fue renombrado.</p>
            <a href="#/" className="btn btn-primario" style={{ marginTop: '16px' }}>
              Volver al Inicio
            </a>
          </div>
        )
      )}

      {ruta.tipo === 'practica' && (
        moduloActual ? (
          <PracticaGuiada modulo={moduloActual} mostrarToast={mostrarToast} />
        ) : (
          <div className="tarjeta" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Módulo no encontrado</h2>
            <a href="#/" className="btn btn-primario" style={{ marginTop: '16px' }}>
              Volver al Inicio
            </a>
          </div>
        )
      )}

      {ruta.tipo === 'quiz' && (
        moduloActual ? (
          <Quiz
            modulo={moduloActual}
            onCompletarModulo={handleActualizarProgreso}
            mostrarToast={mostrarToast}
          />
        ) : (
          <div className="tarjeta" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>Módulo no encontrado</h2>
            <a href="#/" className="btn btn-primario" style={{ marginTop: '16px' }}>
              Volver al Inicio
            </a>
          </div>
        )
      )}

      {ruta.tipo === 'editar' && (
        <Editor
          contenidoInicial={contenido}
          onGuardarContenido={handleGuardarNuevoContenido}
          mostrarToast={mostrarToast}
        />
      )}

      <Toast mensaje={mensajeToast} />
    </div>
  );
};
