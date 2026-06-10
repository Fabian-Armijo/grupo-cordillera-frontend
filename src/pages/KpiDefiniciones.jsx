import React, { useState } from 'react';

export const FormularioCrearKpi = ({ onGuardar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    valorObjetivo: '',
    unidad: 'Unidades',
    tipoCalculo: 'SUMAR_PRODUCTOS', // Por defecto para productos
    categoriaId: '1'                // Por defecto Computación (ID 1 de tu BD)
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const actualizados = { ...prev, [name]: value };

      // Ajuste automático de unidades por usabilidad
      if (name === 'tipoCalculo') {
        actualizados.unidad = value === 'CONTAR_TRANSACCIONES' ? 'Ventas' : 'Unidades';
      }
      return actualizados;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convertimos los números antes de enviar al BFF
    const payload = {
      ...formData,
      valorObjetivo: parseFloat(formData.valorObjetivo),
      categoriaId: formData.tipoCalculo === 'CONTAR_TRANSACCIONES' ? null : Long(formData.categoriaId)
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

      {/* Selector de Tipo de Cálculo (Regra de negocio) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">¿Qué va a medir este KPI?</label>
        <select name="tipoCalculo" value={formData.tipoCalculo} onChange={handleChange} className="mt-1 block w-full border rounded p-2 bg-gray-50">
          <option value="CONTAR_TRANSACCIONES">Contar Ventas Totales (1 por cada golpe de caja)</option>
          <option value="SUMAR_PRODUCTOS">Sumar Unidades Físicas (Cuenta el volumen de productos)</option>
        </select>
      </div>

      {/* Selector dinámico de Categoría: Solo se muestra si vamos a sumar productos */}
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