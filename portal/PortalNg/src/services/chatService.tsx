// Copyright 2025, Battelle Energy Alliance, LLC, ALL RIGHTS RESERVED
import axios from '../api/axios';

export const queryRequestFull = async (query: string) => {
    try {
        const response = await axios.get('/api/chat/query-request-full', {
            params: { query },
        });
        return response.data;
    } catch (error) {
        console.error('Error querying chat:', error.response.data);
        throw error;
    }
};

export const queryRequestStream = async (query: string, onMessage: (message: string) => void) => {
    try {
        const response = await axios.get('/api/chat/query-request-stream', {
            params: { query },
            responseType: 'stream',
        });
        const reader = response.data.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            onMessage(chunk);
        }
    } catch (error) {
        console.error('Error querying chat stream:', error.response.data);
        throw error;
    }
};

export const ping = async () => {
    try {
        const response = await axios.get('/api/chat/ping');
        return response.data;
    } catch (error) {
        console.error('Error pinging chat:', error.response.data);
        throw error;
    }
};