"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import QuestionsSection from './_components/QuestionsSection';
import RecordAnswerSection from './_components/RecordAnswerSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function StartInterview() {

    const [interviewData,setInterviewData]=useState();
    const [mockInterviewQuestion,setMockInterviewQuestion]=useState([]);
    const { interviewId } = useParams();
    const [activeQuestionIndex,setActiveQuestionIndex]=useState(0);
    useEffect(()=>{
        GetInterviewDetails();
    },[])
    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterview)
            .where(eq(MockInterview.mockId, interviewId));
    
        // Check if jsonMockResp is a string and parse it
        let jsonMockResp;
        try {
            jsonMockResp = typeof result[0].jsonMockResp === 'string'
                ? JSON.parse(result[0].jsonMockResp)
                : result[0].jsonMockResp;  // If it's already parsed, use it directly
        } catch (error) {
            console.error("Error parsing JSON:", error);
            jsonMockResp = {};  // Default to an empty object in case of parsing error
        }
    
        // Access the interviewQuestions array
        const interviewQuestions = jsonMockResp.interviewQuestions || [];  // Default to empty array if not present
    
        console.log(interviewQuestions); // Verify the structure of the interviewQuestions array
    
        setMockInterviewQuestion(interviewQuestions);  // Store the interview questions in the state
        setInterviewData(result[0]);  // Store the interview metadata in the state
    };
  return (
    <div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10'> 
            {/* Questions  */}
            <QuestionsSection mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            />

             {/* Video/Audio Recording  */}
            <RecordAnswerSection
            mockInterviewQuestion={mockInterviewQuestion}
            activeQuestionIndex={activeQuestionIndex}
            interviewData={interviewData}
            />
        </div>
        <div className='flex justify-end gap-6'>
           {activeQuestionIndex>0&& 
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex-1)}>Previous Question</Button>}
           {activeQuestionIndex!=mockInterviewQuestion?.length-1&&
           <Button onClick={()=>setActiveQuestionIndex(activeQuestionIndex+1)}>Next Question</Button>}
            {activeQuestionIndex==mockInterviewQuestion?.length-1&&
            <Link href={'/dashboard/interview/'+interviewData?.mockId+"/feedback"}>
            <Button >End Interview</Button>
            </Link>}
        </div>
    </div>
  )
}

export default StartInterview