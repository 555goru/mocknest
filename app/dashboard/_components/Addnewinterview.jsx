

"use client"
import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { chatSession } from '@/utils/GeminiAIModal'
import { LoaderCircle } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import moment from 'moment'
import { MockNest } from '@/utils/schema'
import { db } from '@/utils/db'
import { useRouter } from 'next/navigation'

function Addnewinterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [jobPosition, setJobPosition] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [yearsOfExperience, setYearsOfExperience] = useState("")
  const [errors, setErrors] = useState({ jobPosition: "", jobDescription: "", yearsOfExperience: "" })
  const [loding, setLoding] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([])
  const { user } = useUser();
  const router = useRouter();

  const onsubmit = async (e) => {
    setLoding(true)
    e.preventDefault()
    console.log(jobPosition, jobDescription, yearsOfExperience)

    const InputPrompt = "Job position:" + jobPosition + ", Job description:" + jobDescription + ", years of experience:" + yearsOfExperience + ", depends on this  job position, job description and years of experience give me " + process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT + " Interview questions along with Answer in Json format. Give questions and answers as field in json  "

    const result = await chatSession.sendMessage(InputPrompt)

    const MockJsonResp = (result.response.text()).replace('json', '').replace('', '')

    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if (MockJsonResp) {
      const resp = await db.insert(MockNest).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDesc: jobDescription,
        jobExperience: yearsOfExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy')
      }).returning({ mockId: MockNest.mockId })

      console.log("inserted ID:", resp)
      if (resp) {
        setOpenDialog(false);
        router.push('/dashboard/interview/' + resp[0]?.mockId)
      }
    }
    else {
      console.log("ERROR")
    }
    setLoding(false);
  }

  const handleInputChange = (e) => {
    let value = e.target.value.trimStart();

    if (/^[A-Za-z\s]*$/.test(value)) {
      setJobPosition(value);
      setErrors((prev) => ({ ...prev, jobPosition: "" }));
    } else {
      setErrors((prev) => ({ ...prev, jobPosition: "Only alphabets are allowed!" }));
    }
  };

  const handleJobDescriptionChange = (e) => {
    let value = e.target.value;

    // Remove leading & trailing spaces
    value = value.trimStart();

    // Ensure exactly **one tab space (\t) between words**, but allow anything else
    if (/^(?:[^\t]+\t)*[^\t]+$/.test(value) || value === "") {
      if (value.length >= 10) {
        setErrors((prev) => ({ ...prev, jobDescription: "" }));
      } else {
        setErrors((prev) => ({
          ...prev,
          jobDescription: "Job description must be at least 10 characters!",
        }));
      }
    } else {
      setErrors((prev) => ({
        ...prev,
        jobDescription: "Only one tab space (\\t) is allowed between words!",
      }));
    }

    setJobDescription(value);
  };




  const handleYearsOfExperienceChange = (e) => {
    let value = e.target.value.trim();

    if (value === "") {
      setYearsOfExperience("");
      setErrors((prev) => ({ ...prev, yearsOfExperience: "" }));
      return;
    }

    if (/^\d+$/.test(value)) {
      let num = Number(value);
      if (num >= 1 && num <= 50) {
        setYearsOfExperience(value);
        setErrors((prev) => ({ ...prev, yearsOfExperience: "" }));
        return;
      }
    }

    setErrors((prev) => ({ ...prev, yearsOfExperience: "Enter a valid number between 1 and 50!" }));
    setYearsOfExperience(value);
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Tell us more about your job interview</DialogTitle>
          </DialogHeader>

          <form className="mt-4" onSubmit={onsubmit}>
            <p className="text-gray-600">
              Add details about your job position, job description, and years of experience.
            </p>

            {/* Job Position Input */}
            <div className="mt-7">
              <label className="block font-medium">Job Position/Role</label>
              <Input
                placeholder="Ex: Full Stack Developer"
                className="mt-2"
                type="text"
                value={jobPosition}
                onChange={handleInputChange}
                required
              />
              {errors.jobPosition && <p className="text-red-500 text-sm mt-1">{errors.jobPosition}</p>}
            </div>

            {/* Job Description Input */}
            <div className="mt-7">
              <label className="block font-medium">Job Description/ Tech Stack</label>
              <Textarea
                placeholder="Briefly describe the job..."
                className="mt-2 border p-2 w-full"
                value={jobDescription}
                onChange={handleJobDescriptionChange}
                required
              />
              {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
            </div>

            {/* Years of Experience Input */}
            <div className="mt-7">
              <label className="block font-medium">Years of Experience</label>
              <Input
                type="number"
                placeholder="Enter years (1-50)"
                className="mt-2 border p-2 w-full"
                value={yearsOfExperience}
                onChange={handleYearsOfExperienceChange}
                max="50"
                required
              />
              {errors.yearsOfExperience && <p className="text-red-500 text-sm mt-1">{errors.yearsOfExperience}</p>}
            </div>

            <div className="flex gap-5 justify-end mt-6">
              <Button variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={!!errors.jobPosition || !!errors.jobDescription || !!errors.yearsOfExperience || !jobPosition.trim() || loding}>
                {loding ?
                  <>
                    <LoaderCircle className='animate-spin' />'Generating from AI'
                  </> : 'Start Interview'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Addnewinterview
