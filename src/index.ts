import { env } from "./config/env";
import { app } from "./presentation/server";

app.listen({
    host: "0.0.0.0",
    port: env.PORT
}, () => console.log(`Server running on port ${env.PORT}`));