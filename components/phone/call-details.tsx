import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Play, FileText, PlusCircle } from 'lucide-react'
import { Call } from '@/types/call'

interface CallDetailsProps {
  call: Call
}

export function CallDetails({ call }: CallDetailsProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Number:</span>
            <span className="col-span-3">{call.number}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Date:</span>
            <span className="col-span-3">{call.date}</span>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <span className="font-bold">Duration:</span>
            <span className="col-span-3">{call.duration}</span>
          </div>
          <div>
            <span className="font-bold">Transcription:</span>
            <Textarea
              className="mt-2"
              value={call.transcription}
              readOnly
            />
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Actions</h4>
            <Button className="w-full justify-start">
              <Play className="mr-2 h-4 w-4" />
              Listen to Call
            </Button>
            <Button className="w-full justify-start">
              <FileText className="mr-2 h-4 w-4" />
              Analyze Call
            </Button>
            <Button className="w-full justify-start">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Note
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
