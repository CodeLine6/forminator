"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "./ui/form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ImSpinner2 } from "react-icons/im";
import { BsFileEarmarkPlus } from "react-icons/bs"
import { toast } from "./ui/use-toast";
import { formSchema, formSchemaType } from "@/schemas/form";
import { CreateForm } from "@/actions/form";
import { useRouter } from "next/navigation";


const CreateFormBtn = () => {
    const router = useRouter()
    const form = useForm<formSchemaType>({
        resolver: zodResolver(formSchema)
    })

    const onSubmit = async (data: formSchemaType) => {
        try {
            const formId = await CreateForm(data)
            toast({
                title: "Success",
                description: "Form created successfully",
                variant: "default",
            })
            router.push(`/builder/${formId}`)
        }
        catch (e) {
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "destructive",
            })
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="group border border-primary/20 h-[190px] items-center justify-center flex flex-col hover:border-primary hover:cursor-pointer border-dashed gap-4">
                    <BsFileEarmarkPlus className="h-8 w-8 text-muted-foreground group-hover:text-primary"/>
                    <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create New Form</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create Form
                    </DialogTitle>
                    <DialogDescription>
                        Create a new form & start collecting responses
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name
                                </FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                        <FormField control={form.control} name="description" render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea rows={5} {...field} />
                                </FormControl>
                            </FormItem>
                        )} />
                    </form>
                </Form>
                <DialogFooter>
                            <Button onClick={form.handleSubmit(onSubmit)} disabled={form.formState.isSubmitting} className="w-full mt-4">
                                {!form.formState.isSubmitting && 'Save'}
                                {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
                            </Button>
                        </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFormBtn