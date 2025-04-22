/**
 * SALVITA - Sistema de validación
 * Funciones para validar entradas de usuario
 */

/**
 * Valida que el correo electrónico tenga un formato válido
 * @param {string} correo - El correo a validar
 * @returns {boolean} - Verdadero si el correo tiene formato válido
 */
function validarCorreo(correo) {
    const patron = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return patron.test(correo);
}

/**
 * Valida que la contraseña cumpla con los requisitos mínimos:
 * - Al menos 8 caracteres
 * - Al menos una letra mayúscula
 * - Al menos una letra minúscula
 * - Al menos un número
 * 
 * @param {string} contrasena - La contraseña a validar
 * @returns {boolean} - Verdadero si la contraseña cumple con los requisitos
 */
function validarContrasena(contrasena) {
    // Verifica longitud mínima
    if (contrasena.length < 8) {
        return false;
    }
    
    // Verifica si contiene al menos una letra mayúscula
    if (!/[A-Z]/.test(contrasena)) {
        return false;
    }
    
    // Verifica si contiene al menos una letra minúscula
    if (!/[a-z]/.test(contrasena)) {
        return false;
    }
    
    // Verifica si contiene al menos un número
    if (!/[0-9]/.test(contrasena)) {
        return false;
    }
    
    return true;
}

/**
 * Obtiene un usuario activo desde el almacenamiento local si existe
 * @returns {Object|null} - Datos del usuario activo o null si no hay sesión
 */
function obtenerUsuarioActivo() {
    const usuarioActivo = localStorage.getItem('usuarioActivo');
    return usuarioActivo ? JSON.parse(usuarioActivo) : null;
}

/**
 * Guarda la información del usuario en el almacenamiento local para mantener la sesión
 * @param {Object} usuario - Datos del usuario
 * @param {boolean} mantenerSesion - Si se debe mantener la sesión
 */
function guardarSesion(usuario, mantenerSesion) {
    // No guardar la contraseña en localStorage por seguridad
    const usuarioSesion = {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        id: usuario.id
    };
    
    if (mantenerSesion) {
        localStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));
    } else {
        sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarioSesion));
    }
}

/**
 * Elimina la información de sesión del usuario
 */
function cerrarSesion() {
    localStorage.removeItem('usuarioActivo');
    sessionStorage.removeItem('usuarioActivo');
}
