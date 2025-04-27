import { useState } from 'react';

/**
 * Dummy implementation to replace WebSocket functionality.
 * This ensures existing imports won't break but no actual WebSocket connection is made.
 */
export function useWebSocketEvent(eventName: string) {
    // No WebSocket connection is established
    // Returns null for lastMessage so components don't attempt to use it
    return { lastMessage: null };
} 