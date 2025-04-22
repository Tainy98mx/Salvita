/**
 * SALVITA - Sistema de inicio de sesión y registro
 * Script principal para la aplicación
 */

// Elementos del DOM principales
const vistaInicial = document.getElementById('vistaInicial');
const vistaLogin = document.getElementById('vistaLogin');
const vistaRegistro = document.getElementById('vistaRegistro');
const vistaDashboard = document.getElementById('vistaDashboard');

// Botones de navegación
const btnIniciarSesion = document.getElementById('btnIniciarSesion');
const btnRegistrarse = document.getElementById('btnRegistrarse');
const volverInicio = document.getElementById('volverInicio');
const irARegistro = document.getElementById('irARegistro');
const irALogin = document.getElementById('irALogin');
const volverInicioDesdeRegistro = document.getElementById('volverInicioDesdeRegistro');
const btnCerrarSesion = document.getElementById('btnCerrarSesion');
const olvidoContrasena = document.getElementById('olvidoContrasena');

// Formularios
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');

// Mensajes de error y éxito
const loginError = document.getElementById('loginError');
const registroError = document.getElementById('registroError');
const registroExito = document.getElementById('registroExito');

// Información del usuario en dashboard
const nombreUsuario = document.getElementById('nombreUsuario');
const correoUsuario = document.getElementById('correoUsuario');

/**
 * Cambia entre las diferentes vistas de la aplicación
 * @param {HTMLElement} vistaAMostrar - La vista que se quiere mostrar
 */
function cambiarVista(vistaAMostrar) {
    // Ocultar todas las vistas
    vistaInicial.classList.add('oculto');
    vistaLogin.classList.add('oculto');
    vistaRegistro.classList.add('oculto');
    vistaDashboard.classList.add('oculto');
    
    // Mostrar la vista solicitada con animación
    vistaAMostrar.classList.remove('oculto');
    vistaAMostrar.classList.add('animacion-entrada');
    
    // Limpiar mensajes de error
    ocultarMensajes();
}

/**
 * Oculta todos los mensajes de error y éxito
 */
function ocultarMensajes() {
    loginError.style.display = 'none';
    registroError.style.display = 'none';
    registroExito.style.display = 'none';
    
    // Limpiar mensajes de error en campos individuales
    document.querySelectorAll('.error-mensaje').forEach(elemento => {
        elemento.textContent = '';
    });
}

/**
 * Muestra mensaje de error en el formulario de login
 * @param {string} mensaje - El mensaje de error a mostrar
 */
function mostrarErrorLogin(mensaje) {
    loginError.textContent = mensaje;
    loginError.style.display = 'block';
    loginError.classList.add('animacion-error');
    setTimeout(() => loginError.classList.remove('animacion-error'), 500);
}

/**
 * Muestra mensaje de error en el formulario de registro
 * @param {string} mensaje - El mensaje de error a mostrar
 */
function mostrarErrorRegistro(mensaje) {
    registroError.textContent = mensaje;
    registroError.style.display = 'block';
    registroError.classList.add('animacion-error');
    setTimeout(() => registroError.classList.remove('animacion-error'), 500);
}

/**
 * Muestra mensaje de éxito en el formulario de registro
 * @param {string} mensaje - El mensaje de éxito a mostrar
 */
function mostrarExitoRegistro(mensaje) {
    registroExito.textContent = mensaje;
    registroExito.style.display = 'block';
}

/**
 * Verifica si el usuario ya inició sesión previamente
 */
function verificarSesionActiva() {
    const usuarioActivo = obtenerUsuarioActivo();
    if (usuarioActivo) {
        // Mostrar datos del usuario en el dashboard
        nombreUsuario.textContent = `${usuarioActivo.nombre} ${usuarioActivo.apellido}`;
        correoUsuario.textContent = usuarioActivo.correo;
        cambiarVista(vistaDashboard);
    }
}

/**
 * Event listeners para los botones de navegación
 */
btnIniciarSesion.addEventListener('click', () => cambiarVista(vistaLogin));
btnRegistrarse.addEventListener('click', () => cambiarVista(vistaRegistro));
volverInicio.addEventListener('click', () => cambiarVista(vistaInicial));
irARegistro.addEventListener('click', () => cambiarVista(vistaRegistro));
irALogin.addEventListener('click', () => cambiarVista(vistaLogin));
volverInicioDesdeRegistro.addEventListener('click', () => cambiarVista(vistaInicial));

/**
 * Event listener para el formulario de inicio de sesión
 */
formLogin.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;
    const mantenerSesion = document.getElementById('mantenerSesion').checked;
    
    // Validar campos
    if (!validarCorreo(correo)) {
        mostrarErrorLogin('Por favor, introduce un correo electrónico válido.');
        return;
    }
    
    if (!validarContrasena(contrasena)) {
        mostrarErrorLogin('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.');
        return;
    }
    
    // Intentar iniciar sesión
    iniciarSesion(correo, contrasena, mantenerSesion)
        .then(usuario => {
            if (usuario) {
                // Guardar información del usuario para el dashboard
                nombreUsuario.textContent = `${usuario.nombre} ${usuario.apellido}`;
                correoUsuario.textContent = usuario.correo;
                
                // Cambiar a vista dashboard
                cambiarVista(vistaDashboard);
            } else {
                mostrarErrorLogin('Correo electrónico o contraseña incorrectos.');
            }
        })
        .catch(error => {
            mostrarErrorLogin('Error al iniciar sesión: ' + error.message);
        });
});

/**
 * Event listener para el formulario de registro
 */
formRegistro.addEventListener('submit', function(evento) {
    evento.preventDefault();
    
    const nombre = document.getElementById('regNombre').value;
    const apellido = document.getElementById('regApellido').value;
    const correo = document.getElementById('regCorreo').value;
    const contrasena = document.getElementById('regContrasena').value;
    const confirmarContrasena = document.getElementById('confirmarContrasena').value;
    
    // Validar campos individuales
    let esValido = true;
    
    if (nombre.trim() === '') {
        document.getElementById('nombreError').textContent = 'El nombre es obligatorio';
        esValido = false;
    } else {
        document.getElementById('nombreError').textContent = '';
    }
    
    if (apellido.trim() === '') {
        document.getElementById('apellidoError').textContent = 'El apellido es obligatorio';
        esValido = false;
    } else {
        document.getElementById('apellidoError').textContent = '';
    }
    
    if (!validarCorreo(correo)) {
        document.getElementById('regCorreoError').textContent = 'Introduce un correo electrónico válido';
        esValido = false;
    } else {
        document.getElementById('regCorreoError').textContent = '';
    }
    
    if (!validarContrasena(contrasena)) {
        document.getElementById('regContrasenaError').textContent = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número';
        esValido = false;
    } else {
        document.getElementById('regContrasenaError').textContent = '';
    }
    
    if (contrasena !== confirmarContrasena) {
        document.getElementById('confirmarError').textContent = 'Las contraseñas no coinciden';
        esValido = false;
    } else {
        document.getElementById('confirmarError').textContent = '';
    }
    
    if (!esValido) {
        return;
    }
    
    // Datos del nuevo usuario
    const nuevoUsuario = {
        nombre: nombre,
        apellido: apellido,
        correo: correo,
        contrasena: contrasena
    };
    
    // Registrar nuevo usuario
    registrarUsuario(nuevoUsuario)
        .then(resultado => {
            if (resultado.exito) {
                mostrarExitoRegistro('¡Registro exitoso! Ahora puedes iniciar sesión.');
                // Limpiar formulario
                formRegistro.reset();
                // Redireccionar después de un tiempo
                setTimeout(() => cambiarVista(vistaLogin), 2000);
            } else {
                mostrarErrorRegistro(resultado.mensaje);
            }
        })
        .catch(error => {
            mostrarErrorRegistro('Error al registrar: ' + error.message);
        });
});

/**
 * Event listener para cerrar sesión
 */
btnCerrarSesion.addEventListener('click', function() {
    cerrarSesion();
    cambiarVista(vistaInicial);
});

/**
 * Event listener para olvidé mi contraseña
 */
olvidoContrasena.addEventListener('click', function(evento) {
    evento.preventDefault();
    alert('Funcionalidad de recuperación de contraseña en desarrollo.');
});

// Verificar si hay sesión activa al cargar la página
document.addEventListener('DOMContentLoaded', verificarSesionActiva);
