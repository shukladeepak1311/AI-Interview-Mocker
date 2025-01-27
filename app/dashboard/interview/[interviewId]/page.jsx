"use client";
import { Button } from '@/components/ui/button';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, WebcamIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Webcam from 'react-webcam';

function Interview() {
    const [interviewData, setInterviewData] = useState();
    const [webCamEnabled, setWebCamEnabled] = useState(false);
    const { interviewId } = useParams();

    useEffect(() => {
        console.log("Interview ID:", interviewId); // Debug
        GetInterviewDetails();
    }, []);

    // Fetch interview details by MockId/Interview ID
    const GetInterviewDetails = async () => {
        const result = await db
            .select()
            .from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));
        
        console.log("Result from database:", result); // Debug
        if (result.length > 0) {
            setInterviewData(result[0]);
        } else {
            console.error("No data found for the given interviewId.");
        }
    };

    if (!interviewData) {
        return <div>Loading interview details...</div>;
    }

    return (
        <div className="my-10 ">
            <h2 className="font-bold text-2xl">Let's Get Started</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-10'>

            <div className='flex flex-col my-5 gap-5'>
                <div className='flex flex-col p-5 rounded-lg border gap-3'>
                <h2 className='text-lg'><strong>Job Role/Job Position:</strong> {interviewData?.jobPosition || "N/A"}</h2>
                <h2 className='text-lg'><strong>Job Description/Tech Stack:</strong> {interviewData?.jobDesc || "N/A"}</h2>
                <h2 className='text-lg'><strong>Years of Experience:</strong> {interviewData?.jobExperience || "N/A"}</h2>
            </div>
            <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
                <h2 className='flex gap-2 items-center text-yellow-500'><Lightbulb/><strong>Infor,mation</strong></h2>
                <h2 className='mt-3 text-yellow-500'>{process.env.NEXT_PUBLIC_INFORMATION}</h2>
            </div>
            </div>
            <div>
                {webCamEnabled ? 
                    <Webcam
                        onUserMedia={() => setWebCamEnabled(true)}
                        onUserMediaError={() => setWebCamEnabled(false)}
                        mirrored={true}
                        style={{
                            height: 300,
                            width: 300,
                        }}
                    />
                 : 
                    <>
                        <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
                        <Button variant="ghost" onClick={() => setWebCamEnabled(true)} className='w-full hover:bg-gray-300 transition-all'>Enable Web Cam and Microphone</Button>
                    </>
                }
            </div>

            </div>
            <div className='flex justify-end items-end my-10'>
                <Link href={'/dashboard/interview/'+interviewId+'/start'}>
                <Button>Start Interview</Button>
                </Link>
            
            </div>

            
        </div>
    );
}

export default Interview;
