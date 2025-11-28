import { RouterProvider } from "@tanstack/react-router";
import { LoginContext } from "./LoginContext";
import { useState } from "react";
import type { LoginType } from "../../shared/schemas/ZodSchemas";


type AppProps ={
    router: any
}


export function App({router}: AppProps) {
    const [login, setLogin] = useState<LoginType | false | undefined>(undefined);


    return (
    <LoginContext value={{ login, setLogin }}>
        <RouterProvider router={router} />
    </LoginContext>
    )
}