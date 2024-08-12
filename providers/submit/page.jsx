"use client";

import { createContext } from "react";
import { useReducer } from "react";

export const SubmitContext = createContext()

export const SUBMIT_ACTION = {
    date: 0,
    topic: 1,
    name: 2,
    desc: 3,
    urFiles: 4,
    reFiles: 5
}

export default function SubmitProvider({children}) { 
    function reducer({state, action}){
        switch (action){
            case (SUBMIT_ACTION.date):
                return 0
            case (SUBMIT_ACTION.topic):
                return 0
            case (SUBMIT_ACTION.name):
                return 0
            case (SUBMIT_ACTION.desc):
                return 0
            case (SUBMIT_ACTION.urFiles):
                return 0
            case (SUBMIT_ACTION.reFiles):
                return 0
            default:
                console.error("Error in submit actions")
        }
    }

    const [submitState, submitDispatch] = useReducer(reducer, {
        date: null, topic: null, name: null, desc: null, urFiles: [], reFiles: []
    })

    return (
        <SubmitContext.Provider value={{submitState, submitDispatch}}>
            {children}
        </SubmitContext.Provider>
    )
};
