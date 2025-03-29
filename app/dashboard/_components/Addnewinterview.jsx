"use client"
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { chatSession } from '@/utils/Gemini'
import { LoaderCircle } from 'lucide-react'
import { db } from '@/utils/db'
import { Mocknest } from '@/utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment/moment'
import { useRouter } from 'next/navigation'


function Addnewinterview() {
    const [opendailog, setopenDailog] = useState(false)
    const [jobposition, setjobposition] = useState()
    const [jobdescription, setjobdescription] = useState()
    const [jobexperience, setjobexperience] = useState()
    const [loading, setloading] = useState(false)
    const [jsonresp, setjsonresp] = useState([])
    const router = useRouter()
    const { user } = useUser()

    const onSubmit = async (e) => {
        setloading(true)
        e.preventDefault()
        console.log(jobposition, jobdescription, jobexperience)
        const inputPrompt = "Job Position: " + jobposition + ", Job Description: " + jobdescription + ", Years of Experience: " + jobexperience + ", Depends on Job Position, Job Description and Uears of Experience give us " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " Interview questions along with answers in JSON format, Give us question and answer field on JSON"
        const result = await chatSession.sendMessage(inputPrompt);
        const mockjsonresp = (result.response.text()).replace('```json', '').replace('```', '')
        setjsonresp(mockjsonresp)
        if (mockjsonresp) {
            const resp = await db.insert(Mocknest).values({
                mockId: uuidv4(),
                jsonMockResp: mockjsonresp,
                jobPosition: jobposition,
                jobDesc: jobdescription,
                jobExperience: jobexperience,
                createdBy: user?.primaryEmailAddress?.emailAddress,
                createdAt: moment().format('DD-MM-yyyy'),
            }).returning({ mockId: Mocknest.mockId })

            console.log("inserted id:", resp)
            if (resp) {
                setopenDailog(false)
                console.log(`'/dashboard/interview/${resp[0]?.mockId}`)
                router.push('/dashboard/interview/' + resp[0]?.mockId)
            }
        } else {
            console.log('error')
        }
        setloading(false)
    }
    const JobRoleInput = () => {
        const [jobPosition, setJobPosition] = useState("");

        const handleChange = (event) => {
            let value = event.target.value;

            value = value.trimStart();

            if (/^[A-Za-z\s]*$/.test(value)) {
                setJobPosition(value);
            }
        };

        return (
            <div>
                <div className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
                    onClick={() => setopenDailog(true)}
                >
                    <h2 className='font-bold text-lg text-center'>+  Add New</h2>
                </div>
                <Dialog open={opendailog} onOpenChange={setopenDailog} >

                    <DialogContent className='max-w-2xl'>
                        <DialogHeader>
                            <DialogTitle className='text-2xl'>Tell us more about your job interviewing</DialogTitle>
                            <DialogDescription>
                                <form onSubmit={onSubmit}>

                                    <div>
                                        <h2>Add details about your job position/role, job description and years of experience</h2>
                                        <div className="mt-7 mb-3">
                                            <label htmlFor="job-position" className="block text-sm font-medium text-gray-700">
                                                Job Role/Position
                                            </label>
                                            <input
                                                id="job-position"
                                                type="text"
                                                placeholder="Ex. Full Stack Developer"
                                                required
                                                value={jobPosition}
                                                onChange={handleChange}
                                                className="border rounded-md p-2 w-full"
                                            />
                                        </div>
                                        <div className='my-3'>
                                            <label>Job Descrition (In Short)</label>
                                            <Textarea placeholder='Ex. React, Angular, NodeJs, Mysql etc.' required onChange={(event) => setjobdescription(event.target.value)} />
                                        </div>
                                        <div className='my-3'>
                                            <label>Years of Experience</label>
                                            <Input placeholder='Ex. 5' max="40" min="0" type='number' required onChange={(event) => setjobexperience(event.target.value)} />
                                        </div>
                                    </div>
                                    <div className='flex gap-5 justify-end'>
                                        <Button type="button" variant="ghost" onClick={() => setopenDailog(false)}>Cancel</Button>
                                        <Button type="submit" disabled={loading} className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
                                            {loading ?
                                                <>
                                                    <LoaderCircle className='animate-spin' />Generating Questions

                                                </> : 'Start Interview'
                                            }
                                        </Button>
                                    </div>
                                </form>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

            </div>
        )
    }

    export default Addnewinterview

