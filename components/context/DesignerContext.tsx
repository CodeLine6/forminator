"use client"

import { Dispatch, SetStateAction, createContext, useState } from "react"
import { ElementsType, FormElementInstance } from "../FormElements"

type DesinerContextType = {
    elements :  FormElementInstance[],
    setElements : Dispatch<SetStateAction<FormElementInstance[]>>,
    addElement: (index: number, element : FormElementInstance) => void,
    removeElement: (id: string) => void,
    selectedElement : FormElementInstance | null,
    setSelectedElement : Dispatch<SetStateAction<FormElementInstance | null>>
    updateElement : (id : string, element : FormElementInstance) => void
}

export const DesignerContext = createContext<DesinerContextType | null>(null)

export default function DesignerContextProvider({children} : {children : React.ReactNode}) {
    
    const [elements,setElements] = useState<FormElementInstance[]>([])
    const [selectedElement,setSelectedElement] = useState<FormElementInstance | null>(null)
    const addElement = (index: number, element : FormElementInstance) => {
        setElements(prev => {
            const newElements = [...prev];
            newElements.splice(index, 0, element);
            return newElements
        })
    }
     const removeElement = (id: string) => {
        setElements(prev => {
            return prev.filter(element => element.id !== id)
        })
     }

     const updateElement = (id : string, element : FormElementInstance) => {
        setElements(prev => {
            return prev.map(el => el.id === id ? element : el)
        })  
     }

    return <DesignerContext.Provider value={{elements,addElement,setElements,removeElement,selectedElement,setSelectedElement,updateElement}}>{children}</DesignerContext.Provider>
}