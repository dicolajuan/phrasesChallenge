import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Phrases } from "@/pages";

Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: 1024,
});

Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    value: jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
    })),
});

describe("Phrases Component", () => {
    it("1- Debe renderizar correctamente el título, las frases iniciales y el botón flotante", () => {
        render(<Phrases />);

        const mainTitle = screen.getByText(
            /Bienvenido a la biblioteca de frases!/i
        );
        expect(mainTitle).toBeInTheDocument();

        const examplePhrase = screen.getByText(
            /La mejor inversión siempre será en ti mismo./i
        );
        expect(examplePhrase).toBeInTheDocument();

        const floatingButton = screen.getByTestId("floating-button");
        expect(floatingButton).toBeInTheDocument();
    });

    test('2- Debe renderizar el campo de búsqueda en modo "Buscar"', () => {
        render(<Phrases />);
        
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        expect(searchInput).toBeInTheDocument();
    });

    test('3- Muestra mensaje "No se encontraron frases" cuando la búsqueda no arroja resultados', async () => {
        render(<Phrases />);
        
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        fireEvent.change(searchInput, {
            target: { value: "texto que no existe" },
        });
        
        await waitFor(() =>
            expect(
                screen.getByText(/No se encontraron frases/i)
            ).toBeInTheDocument()
        );
    });

    test('4- Al hacer clic en el botón flotante se cambia al modo "Crear"', async () => {
        render(<Phrases />);
        
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        expect(searchInput).toBeInTheDocument();

        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);

        await waitFor(() =>
            expect(
                screen.getByPlaceholderText(/Presione Enter para guardar la frase/i)
            ).toBeInTheDocument()
        );
    });

    test('5- Agrega una frase y la encuentra en la búsqueda', async () => {
        render(<Phrases />);
        
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
    
        const createInput = await screen.findByPlaceholderText(/Presione Enter para guardar la frase/i);
        expect(createInput).toBeInTheDocument();
    
        fireEvent.change(createInput, { target: { value: "Frase de prueba" } });
    
        fireEvent.keyDown(createInput, { key: "Enter", code: "Enter", charCode: 13 });
    
        fireEvent.blur(createInput);
    
        const searchInput = await screen.findByPlaceholderText(/Buscar en las frases/i);
        expect(searchInput).toBeInTheDocument();
    
        fireEvent.change(searchInput, { target: { value: "prueba" } });

        await waitFor(() => {
          expect(screen.getByText(/Frase de prueba/i)).toBeInTheDocument();
        });
      });

});
