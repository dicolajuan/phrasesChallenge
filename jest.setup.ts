// @ts-expect-error - TextEncoder/TextDecoder no están definidos en el entorno de pruebas
import { TextEncoder, TextDecoder } from "@sinonjs/text-encoding";
import "dotenv/config"; // Cargar variables de entorno desde `.env`

global.TextEncoder = TextEncoder;
global.TextDecoder = new TextDecoder();