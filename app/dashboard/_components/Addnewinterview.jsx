"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { chatSession } from "@/utils/Gemini";
import { LoaderCircle } from "lucide-react";
import { db } from "@/utils/db";
import { Mocknest } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";
import { useUser } from "@clerk/nextjs";
import moment from "moment/moment";
import { useRouter } from "next/navigation";

function Addnewinterview() {
    const [openDialog, setOpenDialog] = useState(false);
    const [jobPosition, setJobPosition] = useState("");
    const [jobDescription, setJobDescription] = useState("");
    const [jobExperience, setJobExperience] = useState("");
    const [loading, setLoading] = useState(false);
    const [jsonResp, setJsonResp] = useState([]);
    const router = useRouter();
    const { user } = useUser();

    const handleJobPositionChange = (event) => {
        let value = event.target.value.trimStart();

        if (/^[A-Za-z\s]*$/.test(value)) {
            setJobPosition(value);
        }
    };

    const handleJobDescriptionChange = (event) => {
        setJobDescription(event.target.value.trim());
    };

    const handleExperienceChange = (event) => {
        let value = event.target.value.replace(/\D/g, "");
        let number = parseInt(value, 10);

        if (!isNaN(number) && number >= 0 && number <= 40) {
            setJobExperience(number);
        } else if (value === "") {
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}. 
    Based on these, generate ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview questions with answers in JSON format.`;

        try {
            const result = await chatSession.sendMessage(inputPrompt);
            const mockJsonResp = result.response.text().replace("```json", "").replace("```", "");
            console.log(mockJsonResp)
            setJsonResp(mockJsonResp);

            if (mockJsonResp) {
                const resp = await db.insert(Mocknest).values({
                    mockId: uuidv4(),
                    jsonMockResp: mockJsonResp,
                    jobPosition,
                    jobDesc: jobDescription,
                    jobExperience,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    createdAt: moment().format("DD-MM-yyyy"),
                }).returning({ mockId: Mocknest.mockId });

                if (resp) {
                    setOpenDialog(false);
                    router.push(`/dashboard/interview/${resp[0]?.mockId}`);
                }
            } else {
                console.error("Error generating interview questions.");
            }
        } catch (error) {
            console.error("Error:", error);
        }

        setLoading(false);
    };

    return (
        <div>
            <div
                className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                onClick={() => setOpenDialog(true)}
            >
                <h2 className="font-bold text-lg text-center">+ Add New</h2>
            </div>

            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Tell us more about your job interviewing
                        </DialogTitle>
                        <DialogDescription>
                            <form onSubmit={onSubmit}>
                                <h2>Add details about your job position/role, job description, and years of experience</h2>

                                <div className="mt-7 mb-3">
                                    <label htmlFor="job-position" className="block text-sm font-medium text-gray-700">
                                        Job Role/Position
                                    </label>
                                    <Input
                                        id="job-position"
                                        type="text"
                                        placeholder="Ex. Full Stack Developer"
                                        required
                                        value={jobPosition}
                                        onChange={handleJobPositionChange}
                                        className="border rounded-md p-2 w-full"
                                    />
                                </div>

                                <div className="my-3">
                                    <label>Job Description (In Short)</label>
                                    <Textarea
                                        placeholder="Ex. React, Angular, NodeJs, MySQL, etc."
                                        required
                                        value={jobDescription}
                                        onChange={handleJobDescriptionChange}
                                    />
                                </div>

                                <div className="my-3">
                                    <label>Years of Experience</label>
                                    <Input
                                        placeholder="Ex. 5"
                                        type="number"
                                        required
                                        min="0"
                                        max="40"
                                        value={jobExperience}
                                        onChange={handleExperienceChange}
                                    />
                                </div>

                                <div className="flex gap-5 justify-end">
                                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                                    >
                                        {loading ? (
                                            <>
                                                <LoaderCircle className="animate-spin" /> Generating Questions
                                            </>
                                        ) : (
                                            "Start Interview"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default Addnewinterview;
