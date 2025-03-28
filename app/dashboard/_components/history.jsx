"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "@/utils/db";
import { eq, desc } from "drizzle-orm";
import { Mocknest } from "@/utils/schema";
import Historyitemcard from "./historyitemcard";

function History() {
    const { user } = useUser();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (user) {
            getHistory();
        }
    }, [user]);

    const getHistory = async () => {
        try {
            const result = await db
                .select()
                .from(Mocknest)
                .where(eq(Mocknest.createdBy, user?.primaryEmailAddress?.emailAddress))
                .orderBy(desc(Mocknest.id));

            console.log(result);
            setHistory(result);
        } catch (error) {
            console.error("Error fetching history:", error);
        }
    };

    return (
        <div>
            <h2 className="font-medium text-xl text-gray-500">History</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
                {history.length > 0 ? (
                    history.map((interview, index) => (
                        <Historyitemcard interview={interview} key={index} />
                    ))
                ) : (
                    <p className="text-gray-400">No history available.</p>
                )}
            </div>
        </div>
    );
}

export default History;
