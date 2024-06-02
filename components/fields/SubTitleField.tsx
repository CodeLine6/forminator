"use client"

import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import useDesigner from "../hooks/useDesigner"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '../ui/form'

import { LuHeading2 } from "react-icons/lu"

const type: ElementsType = "SubTitleField"

const extraAttributes = {
    subTitle : "SubTitle",
}

const propertiesSchema = z.object({
    subTitle : z.string().min(2).max(50),
})

export const SubTitleFieldFormElement : FormElement = {
    type,
    construct : (id) => ({
        id,
        type,
        extraAttributes 
    }),
    designerBtnElement : {
        icon : LuHeading2,
        label : "SubTitle Field"  
    },
    designerComponent : DesignerComponent,
    formComponent : FormComponent,
    propertiesComponent : PropertiesComponent,

    validate : () => true   
}

type CustomInstance = FormElementInstance & {
    extraAttributes : typeof extraAttributes
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>

function DesignerComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {subTitle} = element.extraAttributes
    return <div className="flex flex-col gap-2 w-full">
        <Label className="text-muted-foreground">Subtitle Field</Label>
        <p className="text-lg">{subTitle}</p>
    </div>
}

function FormComponent({
    elementInstance, 
} : {
    elementInstance : FormElementInstance, 
}) {
    const element = elementInstance as CustomInstance

    const {subTitle} = element.extraAttributes
    return <p className="text-sm">{subTitle}</p>
}

function PropertiesComponent({elementInstance} : {elementInstance : FormElementInstance}) {
    const element = elementInstance as CustomInstance
    const {updateElement} = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver : zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues : {
            subTitle : element.extraAttributes.subTitle,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes)
    },[element,form])

    function applyChanges(values: propertiesFormSchemaType) {
        const {subTitle} = values
        updateElement(element.id, {
            ...element,
            extraAttributes : {
                subTitle
            }
        })
    }

    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} onSubmit={e => e.preventDefault()} className="space-y-3">
            <FormField
                control={form.control}
                name="subTitle"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>SubTitle</FormLabel>
                        <FormControl>
                            <Input {...field} 
                            onKeyDown={(e) => {
                                if(e.key === "Enter") e.currentTarget.blur()
                            }}/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </form>
    </Form>
}



