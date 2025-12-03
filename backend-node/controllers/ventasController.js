const Venta = require('../models/Venta');

// Crear nueva venta
exports.create = async (req, res) => {
  try {
    const { producto, cantidad, precioUnit, fecha, moneda } = req.body;

    // Validar datos
    if (!producto || !cantidad || !precioUnit || !fecha) {
      return res.status(400).json({ 
        success: false, 
        message: 'Datos incompletos' 
      });
    }

    // Calcular importe
    const importe = cantidad * precioUnit;

    // Formatear fechas
    const fechaDate = new Date(fecha);
    const fechaISO = fechaDate.toISOString().split('T')[0];
    const mes = fechaISO.substring(0, 7);

    // Crear venta
    const nuevaVenta = new Venta({
      uid: req.session.userId,
      producto,
      cantidad: Number(cantidad),
      precioUnit: Number(precioUnit),
      importe,
      moneda: moneda || 'USD',
      fecha: fechaDate,
      fechaISO,
      mes
    });

    await nuevaVenta.save();

    res.status(201).json({
      success: true,
      id: nuevaVenta._id,
      data: nuevaVenta
    });
  } catch (error) {
    console.error('Error al crear venta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al crear venta' 
    });
  }
};

// Listar ventas con filtros
exports.list = async (req, res) => {
  try {
    const { filter, value } = req.query;
    const userId = req.session.userId;

    let query = { uid: userId };

    // Aplicar filtros
    if (filter === 'day' && value) {
      query.fechaISO = value;
    } else if (filter === 'month' && value) {
      query.mes = value;
    } else if (filter === 'currency' && value) {
      query.moneda = value;
    }

    const ventas = await Venta.find(query)
      .sort({ createdAt: -1 })
      .lean();

    // Formatear respuesta para que coincida con el frontend
    const ventasFormateadas = ventas.map(venta => ({
      id: venta._id.toString(),
      uid: venta.uid.toString(),
      producto: venta.producto,
      cantidad: venta.cantidad,
      precioUnit: venta.precioUnit,
      importe: venta.importe,
      moneda: venta.moneda,
      fecha: venta.fechaISO,
      fechaISO: venta.fechaISO,
      mes: venta.mes,
      created_at: venta.createdAt
    }));

    res.json({
      success: true,
      data: ventasFormateadas
    });
  } catch (error) {
    console.error('Error al listar ventas:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al obtener ventas' 
    });
  }
};

// Eliminar venta
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session.userId;

    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID no proporcionado' 
      });
    }

    // Verificar que la venta pertenece al usuario
    const venta = await Venta.findOne({ _id: id, uid: userId });

    if (!venta) {
      return res.status(404).json({ 
        success: false, 
        message: 'Venta no encontrada' 
      });
    }

    await Venta.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Venta eliminada'
    });
  } catch (error) {
    console.error('Error al eliminar venta:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al eliminar venta' 
    });
  }
};
