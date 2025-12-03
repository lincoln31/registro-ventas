const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

// Registrar nuevo usuario
exports.register = async (req, res) => {
  try {
    const { email, password, nombre } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(409).json({ 
        success: false, 
        message: 'Email ya registrado' 
      });
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const nuevoUsuario = new Usuario({
      email,
      password: hashedPassword,
      nombre
    });

    await nuevoUsuario.save();

    // Guardar sesión
    req.session.userId = nuevoUsuario._id;
    req.session.email = nuevoUsuario.email;

    res.status(201).json({
      success: true,
      user: {
        id: nuevoUsuario._id,
        email: nuevoUsuario.email,
        displayName: nuevoUsuario.nombre
      },
      token: req.sessionID
    });
  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al registrar usuario' 
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar datos
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(404).json({ 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Verificar contraseña
    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      return res.status(401).json({ 
        success: false, 
        message: 'Contraseña incorrecta' 
      });
    }

    // Guardar sesión
    req.session.userId = usuario._id;
    req.session.email = usuario.email;

    res.json({
      success: true,
      user: {
        id: usuario._id,
        email: usuario.email,
        displayName: usuario.nombre
      },
      token: req.sessionID
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al iniciar sesión' 
    });
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ 
        success: false, 
        message: 'Error al cerrar sesión' 
      });
    }
    res.clearCookie('connect.sid');
    res.json({ 
      success: true, 
      message: 'Sesión cerrada' 
    });
  });
};

// Verificar sesión
exports.checkSession = (req, res) => {
  if (req.session.userId) {
    res.json({
      success: true,
      authenticated: true,
      userId: req.session.userId
    });
  } else {
    res.json({
      success: true,
      authenticated: false
    });
  }
};
