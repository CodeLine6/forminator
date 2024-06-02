"use server"

import prisma from "@/lib/prisma"
import { formSchema, formSchemaType } from "@/schemas/form"
import { currentUser } from "@clerk/nextjs/server"

class UserNotFound extends Error {}
export async function GetFormStats() {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()

    const stats = await prisma.form.aggregate({
        where : {
            userId : user.id
        },
        _sum : {
            visits: true,
            submissions : true
        } 
    })

    const visits = stats._sum.visits || 0
    const submissions = stats._sum.submissions || 0

    let submissionRate = 0;
    let bounceRate = 0;
    if(visits > 0) {
        submissionRate = (submissions / visits) * 100
        bounceRate = 100 - submissionRate
    }

    return {
        visits,
        submissions,
        submissionRate,
        bounceRate
    }
}

export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data)
    if(!validation.success) {
        throw new Error("Invalid form data")
    }
    const user = await currentUser()
    if(!user) 
        throw new UserNotFound()

    const {name,description} = data

    const form = await prisma.form.create({
        data : {
            name,
            description,
            userId : user.id
        }
    })

    if(!form)
        throw new Error("Failed to create form")

    return form.id
}

export async function GetForms() {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()
    const forms = await prisma.form.findMany({
        where : {
            userId : user.id
        },
        orderBy : {
            createdAt : "desc"
        }
    })
    return forms
}

export async function GetFormById(id: number) {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()
    const form = await prisma.form.findUnique({
        where : {
            userId : user.id,
            id
        }
    })
    if(!form)
        throw new Error("Form not found")
    return form
}

export async function UpdateFormContent(id: number,jsonContent: string) {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()

    return await prisma.form.update({
        where : {
            userId : user.id,
            id
        },
        data: {
            content: jsonContent
        }
    })
} 

export async function PublishForm(id:number) {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()
    return await prisma.form.update({
        where : {
            userId : user.id,
            id
        },
        data: {
            published: true
        }
    })

}

export async function GetFormContentByUrl(url: string) {
    const form = await prisma.form.update({
        select : {
            content : true
        },
        data : {
            visits : {
                increment : 1
            }
        },
        where : {
            shareURL : url
        }
    })
    if(!form)
        throw new Error("Form not found")
    return form
}

export const SubmitForm = async (formUrl : string, content : string ) => {
    const form = await prisma.form.update({
        where : {
            shareURL : formUrl,
            published : true
        },
        data : {
            submissions : {
                increment : 1
            },
            FormSubmissions : {
                create : {
                    content
                } 
            }   
        }
    });

    if(!form)
        throw new Error("Failed to submit form")
}

export const GetFormWithSubmissions = async (id : number) => {
    const user = await currentUser()
    if(!user)
        throw new UserNotFound()
    const form = await prisma.form.findUnique({
        where : {
            id,
            userId : user.id
        },
        include : {
            FormSubmissions : true
        }
    })
    if(!form)
        throw new Error("Form not found")
    return form
}