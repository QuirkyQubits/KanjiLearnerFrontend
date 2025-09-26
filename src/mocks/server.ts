import { setupServer } from "msw/node";
import { handlers } from "./handlers";

// This is a test-only server
export const server = setupServer(...handlers);
