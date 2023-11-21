import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DailyPrompt() {
    interface Prompt {
        ID: number;
        PromptText: string;
        Theme: string;
    }

    const [prompt, setPrompt] = useState<Prompt | null>(null);

    useEffect(() => {
        const fetchDailyPrompt = async () => {
            try {
                const storedPrompt = localStorage.getItem('dailyPrompt');
                const storedTimestamp = localStorage.getItem('dailyPromptTimestamp');
                const now = Date.now();

                if (storedPrompt && storedTimestamp) {
                    const parsedTimestamp = parseInt(storedTimestamp, 10);
                    if (now < parsedTimestamp) {
                        setPrompt(JSON.parse(storedPrompt));
                        return;
                    } else if (now > parsedTimestamp) {
                        localStorage.removeItem('dailyPrompt');
                        localStorage.removeItem('dailyPromptTimestamp');
                    }
                } else {
                    const response = await axios.get('/prompts/prompt-of-the-day');
                    const fetchedPrompt = response.data;
                    setPrompt(fetchedPrompt);
                    const ttl = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
                    localStorage.setItem('dailyPrompt', JSON.stringify(fetchedPrompt));
                    localStorage.setItem('dailyPromptTimestamp', (now + ttl).toString());
                }


            } catch (error) {
                console.error('Error fetching prompt:', error);
            }
        };

        fetchDailyPrompt();

        const midnight = new Date();
        midnight.setDate(midnight.getDate() + 1);
        midnight.setHours(0, 0, 0, 0);
        const timeUntilMidnight = midnight.getTime() - Date.now();

        const timerId = setTimeout(() => {
            fetchDailyPrompt();
            setInterval(fetchDailyPrompt, 24 * 60 * 60 * 1000);
        }, timeUntilMidnight);

        return () => {
            clearTimeout(timerId);
        };
    }, []);

    return (
        <div>
            {prompt ? (
                <div>
                    <h2 className="lead text-white mb-4">{prompt.PromptText}</h2>
                    <p className='text-white-50'>Theme: {prompt.Theme}</p>
                    {/* Render other prompt details as needed */}
                </div>
            ) : (
                <p>Loading prompt...</p>
            )}
        </div>
    );
}

export default DailyPrompt;
