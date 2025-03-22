import React, { useState } from 'react';
import { Lightbulb, Volume2, WebcamIcon, Wind } from 'lucide-react';
const Questions = ({ question }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleQuestionClick = (index) => {
        setActiveIndex(index);
    };

    const textToSpeach = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance(text)
            speech.rate = 1.5;
            window.speechSynthesis.speak(speech)

        }
        else {
            alert('Sorry, Your Browser does not support to Speak')
        }
    }

    return (
        <div className='p-5 border rounded-lg my-10 '>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2'>
                {question.map((item, index) => (
                    <div
                        key={index}
                        className={`p-2 border rounded-full text-xs md:text-sm text-center curson-pointer ${activeIndex === index ? 'bg-primary text-white' : 'bg-secondary text-gray-700'
                            } hover:bg-primary hover:text-white`}
                        onClick={() => handleQuestionClick(index)}
                    >
                        <h2 className='cursor-pointer text-sm md:text-md text-center'>
                            Question #{index + 1}
                        </h2>
                    </div>

                ))}
            </div>
            <h2 className='text-lg font-semibold my-5 mb-3 text-primary'>
                {`Question #${activeIndex + 1}`}
            </h2>
            <Volume2 className='cursor-pointer' onClick={() => { textToSpeach(question[activeIndex]?.question) }} />
            <p className='my-5 text-md md:text-lg'>{question[activeIndex]?.question}</p>


            <div className='border rounded-lg p-5 bg-blue-100 mt-10'>
                <h2 className='flex gap-2 items-center text-primary'>
                    <Lightbulb />
                    <strong>Note:</strong>
                </h2>
                <h2 className='text-sm text-primary my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
            </div>
        </div>
    );
};

export default Questions;
