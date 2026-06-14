// src/__tests__/components/AllowedTo.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import AllowedTo from '../../components/AllowedTo';
import '@testing-library/jest-dom';

describe('AllowedTo - Componente de control de acceso por rol', () => {

    test('debe mostrar el contenido si el rol del usuario está permitido', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN']} userRole="ROLE_ADMIN">
                <p>Contenido protegido</p>
            </AllowedTo>
        );

        expect(screen.getByText('Contenido protegido')).toBeInTheDocument();
    });

    test('no debe mostrar el contenido si el rol del usuario no está permitido', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN']} userRole="ROLE_USUARIO">
                <p>Contenido protegido</p>
            </AllowedTo>
        );

        expect(screen.queryByText('Contenido protegido')).not.toBeInTheDocument();
    });

    test('debe mostrar el contenido si el rol está en una lista con múltiples roles permitidos', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN', 'ROLE_GERENTE']} userRole="ROLE_GERENTE">
                <button>Acción de gerente</button>
            </AllowedTo>
        );

        expect(screen.getByText('Acción de gerente')).toBeInTheDocument();
    });

    test('no debe mostrar nada si la lista de roles permitidos está vacía', () => {
        render(
            <AllowedTo rolesPermitidos={[]} userRole="ROLE_ADMIN">
                <p>No debería verse</p>
            </AllowedTo>
        );

        expect(screen.queryByText('No debería verse')).not.toBeInTheDocument();
    });

    test('debe renderizar múltiples hijos si el rol está permitido', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN']} userRole="ROLE_ADMIN">
                <p>Elemento 1</p>
                <p>Elemento 2</p>
            </AllowedTo>
        );

        expect(screen.getByText('Elemento 1')).toBeInTheDocument();
        expect(screen.getByText('Elemento 2')).toBeInTheDocument();
    });

    test('no debe renderizar nada si userRole es null', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN']} userRole={null}>
                <p>Invisible</p>
            </AllowedTo>
        );

        expect(screen.queryByText('Invisible')).not.toBeInTheDocument();
    });

    test('no debe renderizar nada si userRole es undefined', () => {
        render(
            <AllowedTo rolesPermitidos={['ROLE_ADMIN']} userRole={undefined}>
                <p>Invisible</p>
            </AllowedTo>
        );

        expect(screen.queryByText('Invisible')).not.toBeInTheDocument();
    });
});