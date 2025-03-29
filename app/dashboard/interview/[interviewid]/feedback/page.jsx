"use client";
import React, { useEffect, useState } from "react";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";
import { userAnswer } from "@/utils/schema";
import { useParams } from "next/navigation";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";
import { Button } from '@/components/ui/button';
import { useRouter } from "next/navigation";
import { Mocknest } from '@/utils/schema';
function Feedback() {
    const router = useRouter();
    const [feedbacklist, setFeedbackList] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const { interviewid } = useParams();

    useEffect(() => {
        if (interviewid) {
            getFeedback();
        }
    }, [interviewid]);

    const getFeedback = async () => {
        try {
            const result = await db
                .select()
                .from(userAnswer)
                .where(eq(userAnswer.mockidref, interviewid));

            console.log(result);
            setFeedbackList(result);

            if (result.length > 0) {
                const ratings = result.map(row => parseInt(row.rating, 10))
                const totalRating = ratings.reduce((sum, item) => sum + item, 0);
                let avgRating = (totalRating / result.length).toFixed(1);
                setAverageRating(Math.min(avgRating, 10));
                await db
                    .update(Mocknest)
                    .set({ feedbackrating: averageRating })
                    .where(eq(Mocknest.mockId, interviewid));

            }
        } catch (error) {
            console.error("Error fetching feedback:", error);
        }
    };

    return (
        <div className="p-10">
            <h2 className="text-3xl font-bold text-green-500">Congratulations!!</h2>
            <h2 className="font-bold text-2xl">Here is your interview feedback</h2>
            <h2 className="text-primary text-lg my-3">
                Your overall rating: <strong>{averageRating}/10</strong>
            </h2>
            <h2 className="text-sm text-gray-500">
                Find below the complete feedback to improve your answers.
            </h2>

            {feedbacklist.length > 0 ? (
                feedbacklist.map((item, index) => (
                    <Collapsible key={index} className="mt-7">
                        <CollapsibleTrigger className=" w-full gap-7 p-2 flex justify-between bg-secondary rounded-lg text-left">
                            {item.question}
                            <ChevronsUpDown className="h-5 w-5" />
                        </CollapsibleTrigger>
                        <CollapsibleContent >
                            <div className="flex flex-col gap-2">
                                <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating:</strong> {item.rating}/10</h2>
                                <h2 className="text-red-900 bg-red-50 text-sm p-2 border rounded-lg"><strong>Your Answer:</strong> {item.userans}</h2>
                                <h2 className="text-green-900 bg-green-50 text-sm p-2 border rounded-lg"><strong>Correct Answer:</strong> {item.correctanswer}</h2>
                                <h2 className="text-primary bg-blue-50 text-sm p-2 border rounded-lg"><strong>Feedback:</strong> {item.feedback}</h2>
                            </div>

                        </CollapsibleContent>
                    </Collapsible>
                ))
            ) : (
                <p className="text-gray-500">No feedback available.</p>
            )}
            <Button className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => router.replace('/dashboard')}>Go Home</Button>

        </div>
    );
}

export default Feedback;
