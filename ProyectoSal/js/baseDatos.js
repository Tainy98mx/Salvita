/**
 * SALVITA - Sistema de gestión de base de datos
 * Funciones para manejar el almacenamiento y recuperación de datos de usuario
 */

/**
 * Simula la búsqueda del usuario en la base de datos JSON
 * @param {string} correo - Correo electrónico del usuario
 * @param {string} contrasena - Contraseña del usuario
 * @param {boolean} mantenerSesion - Si se debe mantener la sesión activa
 * @returns {Promise<Object|null>} - Datos del usuario si se encuentra, null en caso contrario
 */
function iniciarSesion(correo, contrasena, mantenerSesion) {
    return new Promise((resolver, rechazar) => {
        // En un entorno real, esto sería una petición al servidor
        // Para esta simulación, buscamos directamente en nuestra "base de datos local"
        
        // Ejemplo de usuario de prueba (usuarioXXXX0)
        const usuarioPrueba = {
            id: 'usuarioXXXX0',
            nombre: 'Lucas',
            apellido: 'Vázquez',
            correo: 'luca@gmx.com',
            contrasena: 'Lucas1998mx.'
        };
        
        // Lógica para buscar usuario y verificar credenciales
        setTimeout(() => {
            // Verificar si coincide con usuario de prueba
            if (correo === usuarioPrueba.correo && contrasena === usuarioPrueba.contrasena) {
                // Guardar sesión si se solicita
                guardarSesion(usuarioPrueba, mantenerSesion);
                // Devolver datos del usuario (excepto la contraseña)
                const { contrasena: _, ...datosUsuario } = usuarioPrueba;
                resolver(datosUsuario);
            } else {
                // Buscar en otros usuarios registrados
                buscarUsuarioRegistrado(correo, contrasena)
                    .then(usuario => {
                        if (usuario) {
                            guardarSesion(usuario, mantenerSesion);
                            const { contrasena: _, ...datosUsuario } = usuario;
                            resolver(datosUsuario);
                        } else {
                            resolver(null); // No se encontró el usuario
                        }
                    })
                    .catch(error => rechazar(error));
            }
        }, 500); // Simulamos un pequeño retraso para imitar la latencia de red
    });
}

/**
 * Simula la búsqueda de un usuario en los registros de la base de datos
 * @param {string} correo - Correo electrónico a buscar
 * @param {string} contrasena - Contraseña para validar
 * @returns {Promise<Object|null>} - Usuario encontrado o null
 */
function buscarUsuarioRegistrado(correo, contrasena) {
    return new Promise((resolver) => {
        // En una implementación real, aquí se recorrerían las carpetas
        // y archivos JSON en la estructura Database/usuarioXXXX*/registro.json
        
        // Para esta simulación, buscaremos usuarios en localStorage
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        
        const usuarioEncontrado = usuariosRegistrados.find(
            usuario => usuario.correo === correo && usuario.contrasena === contrasena
        );
        
        resolver(usuarioEncontrado || null);
    });
}

/**
 * Registra un nuevo usuario en el sistema
 * @param {Object} usuario - Datos del nuevo usuario
 * @returns {Promise<Object>} - Resultado de la operación
 */
function registrarUsuario(usuario) {
    return new Promise((resolver, rechazar) => {
        // Verificar si el correo ya está registrado
        verificarCorreoExistente(usuario.correo)
            .then(existeCorreo => {
                if (existeCorreo) {
                    resolver({
                        exito: false,
                        mensaje: 'El correo electrónico ya está registrado.'
                    });
                    return;
                }
                
                // Obtener usuarios registrados de localStorage
                const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
                
                // Generar ID único para el nuevo usuario
                const nuevoId = `usuarioXXXX${usuariosRegistrados.length}`;
                
                // Crear objeto de usuario completo
                const nuevoUsuario = {
                    ...usuario,
                    id: nuevoId,
                    fechaRegistro: new Date().toISOString()
                };
                
                // Agregar a la lista de usuarios
                usuariosRegistrados.push(nuevoUsuario);
                
                // Guardar en localStorage (simulando nuestra base de datos JSON)
                localStorage.setItem('usuariosRegistrados', JSON.stringify(usuariosRegistrados));
                
                // Crear estructura Database/usuarioXXXX*/registro.json
                simularCreacionArchivoJSON(nuevoUsuario);
                
                // Retornar éxito
                resolver({
                    exito: true,
                    mensaje: 'Usuario registrado correctamente',
                    usuario: {
                        id: nuevoId,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        correo: usuario.correo
                    }
                });
            })
            .catch(error => rechazar(error));
    });
}

/**
 * Verifica si un correo electrónico ya está registrado
 * @param {string} correo - Correo a verificar
 * @returns {Promise<boolean>} - Verdadero si el correo ya existe
 */
function verificarCorreoExistente(correo) {
    return new Promise((resolver) => {
        // Verificar usuario de prueba
        if (correo === 'luca@gmx.com') {
            resolver(true);
            return;
        }
        
        // Verificar en usuarios registrados
        const usuariosRegistrados = JSON.parse(localStorage.getItem('usuariosRegistrados') || '[]');
        const existeCorreo = usuariosRegistrados.some(usuario => usuario.correo === correo);
        
        resolver(existeCorreo);
    });
}

/**
 * Simula la creación de un archivo JSON para el nuevo usuario
 * Esta función es solo una simulación visual - no crea un archivo real
 * @param {Object} usuario - Datos del usuario a guardar
 */
function simularCreacionArchivoJSON(usuario) {
    console.log(`Simulando creación de archivo: Database/${usuario.id}/registro.json`);
    console.log('Contenido del archivo:', JSON.stringify({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        correo: usuario.correo,
        contrasena: usuario.contrasena
    }, null, 2));
}
