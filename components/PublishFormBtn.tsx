import React, { useTransition } from 'react'
import { Button } from './ui/button'
import { MdOutlinePublish } from 'react-icons/md'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTrigger
} from './ui/alert-dialog'
import { FaSpinner } from 'react-icons/fa'
import { toast } from './ui/use-toast'
import { PublishForm } from '@/actions/form'
import { useRouter } from 'next/navigation'

const PublishFormBtn = ({id} : {id:number}) => {
  const [loading,startTransition] = useTransition()
  const router = useRouter()
  const publishForm = async () => {
    try {
      await PublishForm(id)
      toast({
        title : "Success",
        description: "Your form is now published",
      })
      router.refresh()
    }

    catch(e) {
      toast({
        title : "Error",
        description: "Something went wrong",
        variant : "destructive"
      })
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'} className='gap-2 text-white bg-gradient-to-r from-indigo-400 to-cyan-400'>
          <MdOutlinePublish className='h-6 w-6' /> Publish
        </Button >
      </AlertDialogTrigger>
      <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This Action Cannot be undone. Once published, a form cannot be edited<br/><br/>
              <span className='font-bold'>
                  By publishing this form you will make it available to the public and you will be able to collect submissions.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction disabled={loading}  onClick={(e) => {
              e.preventDefault()
              startTransition(publishForm)
            }}>Proceed {loading && <FaSpinner className="animate-spin" />}</AlertDialogAction>
          </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PublishFormBtn