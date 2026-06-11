import React, { useState } from 'react';
// 1. Importamos el gancho (hook) de autenticación global que creamos en el paso anterior
import { useAuth } from '../components/context/AuthContext.jsx'; // 1. Importamos el contexto global

export const FormularioCrearKpi = ({ onGuardar }) => {
  // 2. Extraemos el usuario y su rol del sistema
  const { user } = useAuth();
  const userRole = user?.role;

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    valorObjetivo: '',
    unidad: 'Unidades',
    tipoCalculo: 'SUMAR_PRODUCTOS',
    categoriaId: '1'
  });

  // REGLA DE SEGURIDAD ABSOLUTA: Si no es ADMIN, se bloquea el renderizado por completo
  if (userRole !== 'ADMIN') {
    return (
        <div className="p-6 bg-red-50 border border-red-200 text-red-700 rounded-lg text-center">
          <h3 className="font-bold text-lg">🚫 Acción No Autorizada</h3>
          <p className="text-sm text-gray-600 mt-1">
            Solo los usuarios con el rol de <strong>Administrador</strong> pueden registrar o definir nuevas métricas KPI.
          </p>
        </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const actualizados = { ...prev, [name]: value };
      if (name === 'tipoCalculo') {
        actualizados.unidad = value === 'CONTAR_TRANSACCIONES' ? 'Ventas' : 'Unidades';
      }
      return actualizados;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // CORRECCIÓN: Se cambia Long() por parseInt() para evitar errores en JavaScript
    const payload = {
      ...formData,
      valorObjetivo: parseFloat(formData.valorObjetivo),
      categoriaId: formData.tipoCalculo === 'CONTAR_TRANSACCIONES' ? null : parseInt(formData.categoriaId, 10)
    };
    onGuardar(payload);
  };

  return (
      <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-bold">Crear Nueva Métrica KPI</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre del KPI</label>
          <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="Ej: Venta de Laptops / PCs" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Meta (Valor Objetivo)</label>
          <input type="number" name="valorObjetivo" value={formData.valorObjetivo} onChange={handleChange} className="mt-1 block w-full border rounded p-2" placeholder="Ej: 50" required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">¿Qué va a medir este KPI?</label>
          <select name="tipoCalculo" value={formData.tipoCalculo} onChange={handleChange} className="mt-1 block w-full border rounded p-2 bg-gray-50">
            <option value="CONTAR_TRANSACCIONES">Contar Ventas Totales (1 por cada golpe de caja)</option>
            <option value="SUMAR_PRODUCTOS">Sumar Unidades Físicas (Cuenta el volumen de productos)</option>
          </select>
        </div>

        {formData.tipoCalculo === 'SUMAR_PRODUCTOS' && (
            <div className="p-3 bg-blue-50 rounded-md border border-blue-200">
              <label className="block text-sm font-medium text-blue-900">Filtrar por Categoría de Producto</label>
              <select name="categoriaId" value={formData.categoriaId} onChange={handleChange} className="mt-1 block w-full border rounded p-2 bg-white">
                <option value="1">Computación (Laptops, PCs de escritorio...)</option>
                <option value="2">Telefonía (Smartphones, smartwatches...)</option>
                <option value="3">Audio (Audífonos, parlantes...)</option>
              </select>
              <p className="text-xs text-blue-700 mt-1">
                * Este KPI solo se acumulará cuando se vendan productos asociados a esta categoría en el catálogo.
              </p>
            </div>
        )}

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Guardar Definición de KPI
        </button>
      </form>
  );
};