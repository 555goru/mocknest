"use client";
import React, { useEffect, useState } from 'react';
import { eq } from "drizzle-orm";
import { db } from '@/utils/db';
import { useParams } from 'next/navigation';  // Using useParams to fetch route parameters
import { Mocknest } from '@/utils/schema';
import Questions from './_components/questions';
import Recordanswer from './_components/recordanswer';
import { Button } from '@/components/ui/button';
import Link from 'next/link'


function Startinterview() {
    const searchParams = useParams();  // Using useParams to get interviewId from the URL path
    const interviewId = searchParams.interviewid;
    const [interviewdata, setinterviewdata] = useState(null);
    const [question, setquestion] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);  // Active index for questions

    useEffect(() => {
        if (interviewId) {
            getinterviewdetails();
        }
    }, [interviewId]);  // Depend on interviewId so this effect runs when it changes

    const getinterviewdetails = async () => {
        try {
            const result = await db
                .select()
                .from(Mocknest)
                .where(eq(Mocknest.mockId, interviewId));

            console.log(result);
            if (result.length > 0) {
                const jsonmockresp = JSON.parse(result[0].jsonMockResp);
                console.log(jsonmockresp);

                setquestion(jsonmockresp);  // Set questions based on the data
                setinterviewdata(result[0]);  // Set the interview data
            } else {
                console.error('Interview data not found');
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };

    useEffect(() => {
        if (interviewdata) {
            console.log(interviewdata);  // Log interview data after it's updated
        }
    }, [interviewdata]);  // Trigger this effect when interviewdata is updated

    return (
        <div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                {question ? (
                    <Questions
                        question={question}
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                    />
                ) : (
                    <div>Loading questions...</div>  // Display a loading state until questions are available
                )}

                <Recordanswer
                    question={question}
                    activeIndex={activeIndex}
                    setActiveIndex={setActiveIndex}
                    interviewdata={interviewdata}
                />
            </div>
            <div className='flex justify-end gap-6'>
                {activeIndex > 0 && <Button className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setActiveIndex(activeIndex - 1)}>Previous</Button>}
                {activeIndex != question.length - 1 && < Button className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => setActiveIndex(activeIndex + 1)}> Next</Button>}
                {activeIndex === question.length - 1 && interviewdata && (
                    <Link href={`/dashboard/interview/${interviewdata?.mockId}/feedback`}>
                        <Button className="hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all">
                            Submit
                        </Button>
                    </Link>
                )}

            </div>
        </div >
    );
}

export default Startinterview;
