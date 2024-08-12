"use client";

import SubmitProvider from "@/providers/submit/page";

export default function WrapSubmitProvider({children}) {
    return (
        <SubmitProvider>
            {children}
        </SubmitProvider>
    )
};

