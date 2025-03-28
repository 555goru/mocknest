"use client";
import React, { useEffect, useState } from 'react';
import { eq } from "drizzle-orm";
import { db } from '@/utils/db';
import { useParams, useRouter } from 'next/navigation';
import { Mocknest } from '@/utils/schema';
import Questions from './_components/questions';
import Recordanswer from './_components/recordanswer';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Startinterview() {
    const router = useRouter();
    const searchParams = useParams();
    const interviewId = searchParams.interviewid;
    const [interviewdata, setinterviewdata] = useState(null);
    const [question, setquestion] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (interviewId) {
            getinterviewdetails();
        }
    }, [interviewId]);

    const autosubmit = async () => {
        try {
            await db
                .update(Mocknest)
                .set({ iscompleted: true })
                .where(eq(Mocknest.mockId, interviewId));
            router.push(`/dashboard/interview/${interviewdata.mockId}/feedback`);
        } catch (err) {
            console.error("Auto-submit failed:", err);
        }
    };

    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'hidden' && interviewdata) {
                autosubmit();
            }
        };

        document.addEventListener('visibilitychange', handleVisibility);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibility);
        };
    }, [interviewdata]);

    const getinterviewdetails = async () => {
        try {
            const result = await db
                .select()
                .from(Mocknest)
                .where(eq(Mocknest.mockId, interviewId));

            if (result.length > 0) {
                const jsonmockresp = JSON.parse(result[0].jsonMockResp);
                setquestion(jsonmockresp);
                setinterviewdata(result[0]);
            } else {
                console.error('Interview data not found');
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {question.length > 0 ? (
                    <Questions
                        question={question}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                ) : (
                    <div>Loading questions...</div>
                )}

                <Recordanswer
                    question={question}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    interviewdata={interviewdata}
                    iscompleted={interviewdata?.iscompleted}
                />
            </div>

            <div className="flex justify-end gap-6 mt-10">
                {activeIndex > 0 && (
                    <Button onClick={() => setActiveIndex(activeIndex - 1)}>
                        Previous
                    </Button>
                )}

                {activeIndex < question.length - 1 && (
                    <Button onClick={() => setActiveIndex(activeIndex + 1)}>
                        Next
                    </Button>
                )}

                {activeIndex === question.length - 1 && interviewdata && (
                    <Link href={`/dashboard/interview/${interviewdata.mockId}/feedback`}>
                        <Button>
                            Submit
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default Startinterview;
