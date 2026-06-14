// src/__tests__/components/KpiCard.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { KpiCard } from '../../components/molecules/KpiCard';
import '@testing-library/jest-dom';

describe('KpiCard - Tarjeta de métrica KPI', () => {

    test('debe mostrar el título correctamente', () => {
        render(<KpiCard title="Ventas Totales" value="$1.500.000" colorClass="border-primary" />);
        expect(screen.getByText('Ventas Totales')).toBeInTheDocument();
    });

    test('debe mostrar el valor correctamente', () => {
        render(<KpiCard title="Ventas Totales" value="$1.500.000" colorClass="border-primary" />);
        expect(screen.getByText('$1.500.000')).toBeInTheDocument();
    });

    test('debe aplicar la clase de color recibida como prop', () => {
        const { container } = render(
            <KpiCard title="Stock" value="42" colorClass="border-success" />
        );
        expect(container.firstChild).toHaveClass('border-success');
    });

    test('debe renderizar el título en mayúsculas (por CSS text-uppercase)', () => {
        render(<KpiCard title="Productos" value="100" colorClass="border-warning" />);
        const titulo = screen.getByText('Productos');
        expect(titulo).toHaveClass('text-uppercase');
    });

    test('debe mostrar el valor 0 sin errores', () => {
        render(<KpiCard title="Sin ventas" value={0} colorClass="border-secondary" />);
        expect(screen.getByText('0')).toBeInTheDocument();
    });

    test('debe mostrar un valor numérico como string', () => {
        render(<KpiCard title="Unidades" value="250" colorClass="border-info" />);
        expect(screen.getByText('250')).toBeInTheDocument();
    });
});