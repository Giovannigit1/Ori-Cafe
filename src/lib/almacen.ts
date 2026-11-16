import { ContenidoAplicacion } from './tipos';
import contenidoPredeterminado from '../data/contenido.json';

const CLAVE_ALMACEN_CONTENIDO = 'ori_cafe_contenido_v1';

/**
 * Interfaz desacoplada para el almacenamiento de contenidos.
 * Permite cambiar entre Fase 1 (LocalStorage) y Fase 2 (Firebase Firestore)
 * sin modificar los componentes de la interfaz.
 */
export interface ServicioAlmacen {
  cargarContenido(): Promise<ContenidoAplicacion>;
  guardarContenido(contenido: ContenidoAplicacion): Promise<void>;
  restablecer(): Promise<ContenidoAplicacion>;
  exportarJSON(): string;
  importarJSON(jsonStr: string): Promise<ContenidoAplicacion>;
}

/**
 * Implementación Fase 1: LocalStorage con fallback a contenido.json
 */
class LocalAlmacenService implements ServicioAlmacen {
  async cargarContenido(): Promise<ContenidoAplicacion> {
    try {
      const guardado = localStorage.getItem(CLAVE_ALMACEN_CONTENIDO);
      if (guardado) {
        const parsed = JSON.parse(guardado) as ContenidoAplicacion;
        if (parsed && Array.isArray(parsed.modulos) && parsed.modulos.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Error leyendo contenido de localStorage, usando contenido base:', e);
    }
    return contenidoPredeterminado as unknown as ContenidoAplicacion;
  }

  async guardarContenido(contenido: ContenidoAplicacion): Promise<void> {
    try {
      localStorage.setItem(CLAVE_ALMACEN_CONTENIDO, JSON.stringify(contenido, null, 2));
    } catch (e) {
      console.error('Error guardando contenido en localStorage:', e);
      throw new Error('No se pudo guardar el contenido en el almacenamiento local.');
    }
  }

  async restablecer(): Promise<ContenidoAplicacion> {
    try {
      localStorage.removeItem(CLAVE_ALMACEN_CONTENIDO);
    } catch (e) {
      console.warn('Error restableciendo contenido:', e);
    }
    return contenidoPredeterminado as unknown as ContenidoAplicacion;
  }

  exportarJSON(): string {
    const raw = localStorage.getItem(CLAVE_ALMACEN_CONTENIDO);
    if (raw) return raw;
    return JSON.stringify(contenidoPredeterminado, null, 2);
  }

  async importarJSON(jsonStr: string): Promise<ContenidoAplicacion> {
    try {
      const parsed = JSON.parse(jsonStr) as ContenidoAplicacion;
      if (!parsed || !Array.isArray(parsed.modulos) || parsed.modulos.length === 0) {
        throw new Error('El archivo JSON no tiene la estructura de módulos requerida.');
      }
      await this.guardarContenido(parsed);
      return parsed;
    } catch (e) {
      console.error('Error al importar JSON:', e);
      throw new Error('El archivo importado no es un JSON válido de Ori Café.');
    }
  }
}

/**
 * Implementación Fase 2: Conexión con Firebase Firestore
 * Deja la estructura lista para cuando se añadan las credenciales de Firebase.
 */
export class FirebaseAlmacenService implements ServicioAlmacen {
  async cargarContenido(): Promise<ContenidoAplicacion> {
    // Cuando se habilite Firebase en Fase 2:
    // const docSnap = await getDoc(doc(db, "capacitacion", "contenido"));
    // if (docSnap.exists()) return docSnap.data() as ContenidoAplicacion;
    console.info('Firebase Firestore listo para conectar en Fase 2. Usando fallback local.');
    return new LocalAlmacenService().cargarContenido();
  }

  async guardarContenido(contenido: ContenidoAplicacion): Promise<void> {
    // await setDoc(doc(db, "capacitacion", "contenido"), contenido);
    console.info('Guardando en Firebase Firestore (Fase 2)...');
    return new LocalAlmacenService().guardarContenido(contenido);
  }

  async restablecer(): Promise<ContenidoAplicacion> {
    return new LocalAlmacenService().restablecer();
  }

  exportarJSON(): string {
    return new LocalAlmacenService().exportarJSON();
  }

  async importarJSON(jsonStr: string): Promise<ContenidoAplicacion> {
    const parsed = await new LocalAlmacenService().importarJSON(jsonStr);
    await this.guardarContenido(parsed);
    return parsed;
  }
}

// Instancia singleton por defecto (Fase 1)
export const almacen: ServicioAlmacen = new LocalAlmacenService();
