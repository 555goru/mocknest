import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/utils/db";

function Historyitemcard({ interview }) {
    const router = useRouter();

    const onStart = () => {
        router.push(`/dashboard/interview/${interview?.mockId}`);
    };



    const onFeedback = () => {
        router.push(`/dashboard/interview/${interview?.mockId}/feedback`);
    };

    return (
        <div className="border shadow-sm rounded-lg p-3">
            <h2 className="font-bold text-primary">{interview?.jobPosition}</h2>
            <h2 className="text-sm text-gray-600">{interview?.jobExperience} Years of Experience</h2>
            <h2 className="text-xs text-gray-400">
                Created At: {interview?.createdAt}
            </h2>

            <div className="flex justify-between mt-2 gap-5">
                <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={onFeedback}
                >
                    Feedback
                </Button>
                {interview.iscompleted == false &&

                    <Button

                        onClick={onStart}
                        className="w-full hover:bg-primary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
                    >
                        Start
                    </Button>
                }
            </div>
        </div>
    );
}

export default Historyitemcard;
