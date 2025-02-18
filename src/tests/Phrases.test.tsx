// import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Phrases } from "@/pages";
import { PhrasesProvider } from "@/context/PhrasesContext";

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

jest.mock("@/utilities/constants.utility.ts", () => ({
    VITE_NODE_ENV: "development",
    VITE_PHRASES_API_KEY: "paporh1ble5ypmk125i0i55wbaxh8fibibehss8c",
}));

describe("Phrases Component", () => {
    it("1- Debe renderizar correctamente el título y el botón flotante", () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        const mainTitle = screen.getByText(
            /Bienvenido a la biblioteca de frases!/i
        );
        expect(mainTitle).toBeInTheDocument();

        const floatingButton = screen.getByTestId("floating-button");
        expect(floatingButton).toBeInTheDocument();
    });

    test('2- Debe renderizar el campo de búsqueda en modo "Buscar"', () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        expect(searchInput).toBeInTheDocument();
    });

    test('3- Muestra mensaje "No se encontraron frases" cuando la búsqueda no arroja resultados', async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

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
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        expect(searchInput).toBeInTheDocument();

        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);

        await waitFor(() =>
            expect(
                screen.getByPlaceholderText(
                    /Presione Enter para guardar la frase/i
                )
            ).toBeInTheDocument()
        );
    });

    test("5- Agrega una frase y la encuentra en la búsqueda", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);

        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        expect(createInput).toBeInTheDocument();

        fireEvent.change(createInput, { target: { value: "Frase de prueba" } });

        fireEvent.keyDown(createInput, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
        });

        fireEvent.blur(createInput);

        const searchInput = await screen.findByPlaceholderText(
            /Buscar en las frases/i
        );
        expect(searchInput).toBeInTheDocument();

        fireEvent.change(searchInput, { target: { value: "prueba" } });

        await waitFor(() => {
            expect(screen.getByText(/Frase de prueba/i)).toBeInTheDocument();
        });
    });

    test("6- Elimina una frase correctamente", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear una frase para eliminar
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Frase a eliminar" },
        });
        fireEvent.keyDown(createInput, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
        });

        // Abrir modal y eliminar
        const phraseCard = screen.getByText("Frase a eliminar");
        fireEvent.click(phraseCard);
        const deleteButton = screen.getByLabelText(/Eliminar frase/i);
        fireEvent.click(deleteButton);

        // Verificar que la frase ya no existe
        expect(screen.queryByText("Frase a eliminar")).not.toBeInTheDocument();
    });

    test("7- Verifica que no se pueden crear frases vacías", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);

        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, { target: { value: "" } });
        fireEvent.keyDown(createInput, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
        });

        // Verificar que seguimos en modo creación
        expect(
            screen.getByPlaceholderText(/Presione Enter para guardar la frase/i)
        ).toBeInTheDocument();
    });

    test("8- Verifica el comportamiento responsivo del contador de frases visibles", async () => {
        // Simular diferentes anchos de pantalla
        global.innerWidth = 1024;
        global.dispatchEvent(new Event("resize"));
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear suficientes frases para probar
        const floatingButton = screen.getByTestId("floating-button");
        for (let i = 1; i <= 12; i++) {
            fireEvent.click(floatingButton);
            const createInput = await screen.findByPlaceholderText(
                /Presione Enter para guardar la frase/i
            );
            fireEvent.change(createInput, { target: { value: `Frase ${i}` } });
            fireEvent.keyDown(createInput, {
                key: "Enter",
                code: "Enter",
                charCode: 13,
            });
            fireEvent.blur(createInput);
        }

        // En 1024px deberían mostrarse 9 frases inicialmente
        const initialPhrases = screen.getAllByRole("button");
        expect(initialPhrases.length).toBe(10); // 9 frases + botón flotante
    });
});

describe("Funcionalidad de búsqueda", () => {
    test("9- La búsqueda debe ser insensible a mayúsculas/minúsculas", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear frase de prueba
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Test Búsqueda Insensible" },
        });
        fireEvent.keyDown(createInput, { key: "Enter" });
        fireEvent.blur(createInput);

        // Buscar en minúsculas
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        fireEvent.change(searchInput, { target: { value: "test búsqueda" } });

        await waitFor(() => {
            expect(
                screen.getByText("Test Búsqueda Insensible")
            ).toBeInTheDocument();
        });
    });

    test("10- La búsqueda debe funcionar con palabras parciales", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear frase de prueba
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Programación es divertida" },
        });
        fireEvent.keyDown(createInput, { key: "Enter" });
        fireEvent.blur(createInput);

        // Buscar parte de la palabra
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        fireEvent.change(searchInput, { target: { value: "progra" } });

        await waitFor(() => {
            expect(
                screen.getByText("Programación es divertida")
            ).toBeInTheDocument();
        });
    });
});

describe("Funcionalidad de favoritos", () => {
    test("11- Las frases favoritas deben mantenerse al principio después de una búsqueda", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear dos frases
        const floatingButton = screen.getByTestId("floating-button");

        // Primera frase
        fireEvent.click(floatingButton);
        let createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Primera frase test" },
        });
        fireEvent.keyDown(createInput, { key: "Enter" });

        // Segunda frase
        fireEvent.click(floatingButton);
        createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Segunda frase test" },
        });
        fireEvent.keyDown(createInput, { key: "Enter" });

        // Marcar la segunda como favorita
        const secondPhrase = screen.getByText("Segunda frase test");
        fireEvent.click(secondPhrase);
        const favoriteButton = screen.getByTestId("favorite-button");
        fireEvent.click(favoriteButton);

        // Realizar búsqueda
        const searchInput =
            screen.getByPlaceholderText(/Buscar en las frases/i);
        fireEvent.change(searchInput, { target: { value: "test" } });

        // Verificar orden
        const phraseElements = await screen.findAllByTestId("phrase-text");
        expect(phraseElements[0]).toHaveTextContent("Segunda frase test");
    });

    test("12- Marca una frase como favorita y verifica que se mantiene al principio de la lista", async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear una frase
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
        const createInput = await screen.findByPlaceholderText(
            /Presione Enter para guardar la frase/i
        );
        fireEvent.change(createInput, {
            target: { value: "Nueva frase favorita test" },
        });
        fireEvent.keyDown(createInput, {
            key: "Enter",
            code: "Enter",
            charCode: 13,
        });

        // Abrir modal y marcar como favorita
        const phraseCard = screen.getByText("Nueva frase favorita test");
        fireEvent.click(phraseCard);
        const favoriteButton = screen.getByTestId("favorite-button");
        fireEvent.click(favoriteButton);

        // Verificar que aparece el ícono de favorito
        const favoriteIcons = screen.getAllByTestId("favorite-icon");
        expect(favoriteIcons.length).toBeGreaterThan(0);
        expect(favoriteIcons[0]).toBeInTheDocument();

        // Si necesitas verificar el texto específico de la frase
        const phraseElements = screen.getAllByTestId("phrase-text");
        expect(phraseElements[0]).toHaveTextContent(
            "Nueva frase favorita test"
        );
    });
});

describe("Funcionalidad del modal", () => {
    test('13- El modal debe cerrarse al hacer clic fuera', async () => {
        render(
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        );

        // Crear y abrir frase
        const floatingButton = screen.getByTestId("floating-button");
        fireEvent.click(floatingButton);
        const createInput = await screen.findByPlaceholderText(/Presione Enter para guardar la frase/i);
        fireEvent.change(createInput, { target: { value: "Frase modal test" } });
        fireEvent.keyDown(createInput, { key: "Enter" });

        // Abrir modal
        const phraseCard = screen.getByText("Frase modal test");
        fireEvent.click(phraseCard);

        // Verificar que el modal está abierto
        const modal = screen.getByRole("presentation");
        expect(modal).toBeInTheDocument();

        fireEvent.blur(modal);

        const firstDivInModal = modal.querySelector("div");

        // Verificar que el modal se cerró
        await waitFor(() => {
            expect(firstDivInModal).toHaveAttribute("aria-hidden", "true");;
        });
    });
});
