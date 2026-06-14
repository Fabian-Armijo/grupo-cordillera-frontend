// src/__tests__/hooks/hooks.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { useInventory } from '../../hooks/useInventory';
import { useKpis } from '../../hooks/useKpis';
import { useVenta } from '../../hooks/useVenta';
import { useListarVentas } from '../../hooks/useListarVentas';
import * as inventoryService from '../../services/inventoryService';
import * as ventaService from '../../services/ventaService';
import { act } from '@testing-library/react';
import { kpiService } from '../../services/kpiService';

// Mocks de servicios
jest.mock('../../services/inventoryService');
jest.mock('../../services/kpiService');
jest.mock('../../services/kpiService', () => ({
    kpiService: {
        getDashboardMetrics: jest.fn(),
        getDefiniciones: jest.fn(),
    },
}));
beforeEach(() => {
    jest.clearAllMocks();
});

// -------------------------------------------------------
// useInventory
// -------------------------------------------------------

describe('useInventory', () => {

    test('debe retornar loading=true inicialmente', () => {
        inventoryService.getInventoryData.mockResolvedValue([]);
        const { result } = renderHook(() => useInventory());
        expect(result.current.loading).toBe(true);
    });

    test('debe cargar los datos del inventario correctamente', async () => {
        const mockData = [{ id: 1, nombre: 'Producto A', stock: 10 }];
        inventoryService.getInventoryData.mockResolvedValue(mockData);

        const { result } = renderHook(() => useInventory());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.data).toEqual(mockData);
        expect(result.current.error).toBeNull();
    });

    test('debe capturar el error si el servicio falla', async () => {
        inventoryService.getInventoryData.mockRejectedValue(new Error('Sin conexión'));

        const { result } = renderHook(() => useInventory());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Sin conexión');
        expect(result.current.data).toEqual([]);
    });
});

// -------------------------------------------------------
// useKpis
// -------------------------------------------------------

describe('useKpis', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe retornar loading=true inicialmente', () => {
        kpiService.getDashboardMetrics.mockResolvedValue([]);

        const { result } = renderHook(() => useKpis());

        expect(result.current.loading).toBe(true);
    });

    test('debe cargar los KPIs correctamente', async () => {
        const mockKpis = [
            { id: 1, nombre: 'Ventas', valor: 5000 }
        ];

        kpiService.getDashboardMetrics.mockResolvedValue(mockKpis);

        const { result } = renderHook(() => useKpis());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.kpis).toEqual(mockKpis);
        expect(result.current.error).toBeNull();
    });

    test('debe capturar el error si el servicio de KPIs falla', async () => {
        kpiService.getDashboardMetrics.mockRejectedValue(
            new Error('Error al cargar métricas')
        );

        const { result } = renderHook(() => useKpis());

        await waitFor(() => {
            expect(result.current.loading).toBe(false);
        });

        expect(result.current.error).toBe('Error al cargar métricas');
        expect(result.current.kpis).toEqual([]);
    });
});

// -------------------------------------------------------
// useVenta
// -------------------------------------------------------

describe('useVenta', () => {

    test('debe tener estado inicial correcto', () => {
        const { result } = renderHook(() => useVenta());
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
        expect(result.current.ventaExitosa).toBe(false);
    });

    test('procesarVenta() debe marcar ventaExitosa=true si el servicio responde OK', async () => {
        ventaService.postCrearVenta.mockResolvedValue({ id: 99 });

        const { result } = renderHook(() => useVenta());

        await result.current.procesarVenta({
            productoId: 1,
            cantidad: 2
        });

        await waitFor(() => expect(result.current.ventaExitosa).toBe(true));
        expect(result.current.error).toBeNull();
    });

    test('procesarVenta() debe capturar error si el servicio falla', async () => {
        ventaService.postCrearVenta.mockRejectedValue(
            new Error('Stock insuficiente')
        );

        const { result } = renderHook(() => useVenta());

        await result.current.procesarVenta({
            productoId: 1,
            cantidad: 999
        });

        await waitFor(() =>
            expect(result.current.error).toBe('Stock insuficiente')
        );

        expect(result.current.ventaExitosa).toBe(false);
    });

    test('procesarVenta() debe poner loading=false al terminar exitosamente', async () => {
        ventaService.postCrearVenta.mockResolvedValue({});

        const { result } = renderHook(() => useVenta());

        await result.current.procesarVenta({
            productoId: 1,
            cantidad: 1
        });

        await waitFor(() =>
            expect(result.current.loading).toBe(false)
        );
    });
});

// -------------------------------------------------------
// useListarVentas
// -------------------------------------------------------

describe('useListarVentas', () => {

    test('debe retornar loading=true inicialmente', () => {
        ventaService.getListaVentas.mockResolvedValue([]);
        const { result } = renderHook(() => useListarVentas());
        expect(result.current.loading).toBe(true);
    });

    test('debe cargar la lista de ventas correctamente', async () => {
        const mockVentas = [{ id: 1, total: 5000 }, { id: 2, total: 3000 }];
        ventaService.getListaVentas.mockResolvedValue(mockVentas);

        const { result } = renderHook(() => useListarVentas());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.ventas).toEqual(mockVentas);
        expect(result.current.error).toBeNull();
    });

    test('debe capturar error si el servicio de ventas falla', async () => {
        ventaService.getListaVentas.mockRejectedValue(new Error('Error al listar ventas'));

        const { result } = renderHook(() => useListarVentas());

        await waitFor(() => expect(result.current.loading).toBe(false));

        expect(result.current.error).toBe('Error al listar ventas');
        expect(result.current.ventas).toEqual([]);
    });

    test('refrescar() debe volver a llamar al servicio', async () => {
        ventaService.getListaVentas.mockResolvedValue([{ id: 1 }]);

        const { result } = renderHook(() => useListarVentas());

        await waitFor(() =>
            expect(result.current.loading).toBe(false)
        );

        await act(async () => {
            await result.current.refrescar();
        });

        await waitFor(() =>
            expect(result.current.loading).toBe(false)
        );

        expect(ventaService.getListaVentas).toHaveBeenCalledTimes(2);
    });
});