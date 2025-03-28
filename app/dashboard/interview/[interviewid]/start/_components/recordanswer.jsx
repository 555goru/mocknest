"use client"
import Webcam from 'react-webcam';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic, StopCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { chatSession } from '@/utils/Gemini';
import { userAnswer } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment';
import { db } from '@/utils/db'

function Recordanswer({ question, activeIndex, iscompleted, setActiveIndex, interviewdata }) {
    const { toast } = useToast();
    const [answer, setanswer] = useState('');
    const { user } = useUser()
    const [loading, setloading] = useState(false)
    const startstoprecording = async () => {
        if (isRecording) {

            stopSpeechToText();


        } else {
            startSpeechToText();
        }
    };



    const updateanswer = async () => {
        console.log(answer)
        setloading(true)
        const feedbackprompt = "Question:" + question[activeIndex]?.question + ", User Answer: " + answer + ", depends on question and user answer for given interview question " +
            " please give us rating for answer and feedback as area of improvement if any " +
            " in just 3 to 5 lines to improve it in JSON format with rating field and feedback field";

        const result = await chatSession.sendMessage(feedbackprompt);

        const mockjsonresp = (result.response.text()).replace('```json', '').replace('```', '');
        console.log(mockjsonresp);
        const jsonfeedback = JSON.parse(mockjsonresp)

        const resp = await db.insert(userAnswer).values({
            mockidref: interviewdata?.mockId,
            question: question[activeIndex]?.question,
            correctanswer: question[activeIndex]?.answer,
            userans: answer,
            feedback: jsonfeedback?.feedback,
            rating: jsonfeedback?.rating,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy')
        })
        if (resp) {
            toast({
                description: "Answer Recorded Successfully",
            });
            setResults([])
            setanswer('')
        }
        setResults([])
        setanswer('')
        setloading(false)
    }

    const { error, interimResult, isRecording, results, startSpeechToText, stopSpeechToText, setResults } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    });

    useEffect(() => {
        results.map((result) => {
            setanswer(prevans => prevans + result?.transcript);
        });
    }, [results]);

    useEffect(() => {
        if (!isRecording && answer.length > 10) {
            updateanswer()
        }

    }, [answer])

    const requestCameraPermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the camera after checking permission
        } catch (err) {
            alert('Camera permission is denied or unavailable.');
        }
    };

    useEffect(() => {
        requestCameraPermission();
    }, []);

    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center items-center bg-black rounded-lg mt-20'>
                <img
                    alt=""
                    src="https://png.pngtree.com/png-vector/20190927/ourmid/pngtree-webcam-icon-isolated-on-abstract-background-png-image_1746609.jpg"
                    className="absolute"
                    width={200} height={300}
                />
                <Webcam
                    mirrored={true}
                    style={{
                        height: 300,
                        width: '100%',
                        zIndex: 10
                    }} />
            </div>
            <Button
                disabled={loading || iscompleted}
                onClick={startstoprecording}
                variant="outline"
                className="my-10"
            >
                {isRecording ? (
                    <h2 className="text-red-600 animate-pulse gap-2 flex items-center">
                        <StopCircle className='mr-2' /> Recording...
                    </h2>
                ) : (
                    <h2 className='flex gap-2 items-center text-primary'>
                        <Mic className="mr-2" />
                        Record Answer
                    </h2>
                )}
            </Button>

        </div>
    );
}

export default Recordanswer;
