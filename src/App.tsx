import { createBrowserRouter, RouterProvider } from "react-router";
import { NotFound, Phrases, TestError } from "./pages";
import { PhrasesProvider } from "@/context/PhrasesContext";
import { UiError } from "./components";

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <PhrasesProvider>
                <Phrases />
            </PhrasesProvider>
        ),
        errorElement: <UiError page={"Phrases"} />,
    },
    {
        path: "/test-error",
        element: <TestError />,
        errorElement: <UiError page={"Test Error"} />,
    },
    {
        path: "*",
        element: <NotFound />,
        errorElement: <UiError page={"404 Not Found"} />,
    },
]);

function App() {
    return (
            <main className="h-full w-full">
                <RouterProvider router={router} />
            </main>
    );
}

export default App;
