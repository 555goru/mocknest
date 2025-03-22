"use client"
import Webcam from 'react-webcam'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text'
import { Mic, StopCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'


function Recordanswer() {
    const { toast } = useToast();
    const [answer, setanswer] = useState('')
    const saveanswer = () => {
        if (isRecording) {
            stopSpeechToText()
            if (answer?.length < 10) {
                toast({
                    description: "Your",
                })
                return;
            }

        }
        else {
            startSpeechToText()
        }
    }

    const {
        error,
        interimResult,
        isRecording,
        results,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false
    })

    useEffect(() => {
        results.map((result) => {
            setanswer(prevans => prevans + result?.transcript)
        })
    }, [results])


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
                onClick={saveanswer}
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


            <Button className='hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all' onClick={() => console.log(answer)}>Show Answer</Button>
        </div>
    )
}

export default Recordanswer