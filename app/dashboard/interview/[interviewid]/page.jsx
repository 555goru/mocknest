"use client";
import { db } from '@/utils/db';
import { Mocknest } from '@/utils/schema';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { eq } from "drizzle-orm";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/router';

function Interview() {
    const [interviewdata, setinterviewdata] = useState(null);
    const [webcamenable, setwebcamenable] = useState(false);

    const searchParams = useParams();
    const interviewId = searchParams.interviewid;

    useEffect(() => {
        if (interviewId) {
            console.log('Interview ID:', interviewId);
            getinterviewdetails();
        }
    }, [interviewId]);

    const getinterviewdetails = async () => {
        try {
            const result = await db
                .select()
                .from(Mocknest)
                .where(eq(Mocknest.mockId, interviewId));

            console.log(result);
            if (result.length > 0) {
                setinterviewdata(result[0]);
            } else {
                console.error('Interview not found');
            }
        } catch (error) {
            console.error('Error fetching interview details:', error);
        }
    };

    useEffect(() => {
        if (interviewdata) {
            console.log(interviewdata);
        }
    }, [interviewdata]);

    return (
        <div className='my-10'>
            <h2 className='font-bold text-2xl'>Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>
                <div className='flex gap-5 flex-col my-5'>
                    {interviewdata ? (
                        <div className='flex flex-col p-5 gap-5 rounded-lg border'>
                            <h2 className='text-lg'><strong>Job Role/Job Position: </strong>{interviewdata.jobPosition}</h2>
                            <h2 className='text-lg'><strong>Job Description/Tech Stack: </strong>{interviewdata.jobDesc}</h2>
                            <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewdata.jobExperience}</h2>
                        </div>
                    ) : (
                        <div>Loading interview data...</div>
                    )}
                    <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-100'>
                        <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb /><strong>Information </strong></h2>
                        <h2 className='mt-3'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
                    </div>
                </div>
                <div className=''>
                    {webcamenable ? (
                        <Webcam
                            onUserMedia={() => setwebcamenable(true)}
                            onUserMediaError={() => setwebcamenable(false)}
                            mirrored={true}
                            style={{ height: 300, width: '100%' }}
                        />
                    ) : (
                        <>
                            <WebcamIcon className='h-72 w-full my-7 p-20 bg-secondary rounded-lg border' />
                            <Button variant="ghost" className='w-full' onClick={() => setwebcamenable(true)}>Enable Camera</Button>
                        </>
                    )}
                </div>
            </div>
            <div className='flex justify-end items-end'>
                {interviewdata && (
                    <Button onClick={() => window.location.href = `/dashboard/interview/${interviewdata.mockId}/start`} className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all'>
                        Start Interview
                    </Button>
                )}
            </div>
        </div>
    );
}

export default Interview;
