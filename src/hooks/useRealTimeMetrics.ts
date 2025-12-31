import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { setRealTimeMetrics, setSSEConnected, clearRealTimeMetrics } from 'slices/campaigns/reducer';
import { CONFIG } from '../config/api.config';
import type { RealTimeMetrics } from '../types/campaigns';
import type { AppDispatch } from 'store/store';

export const useRealTimeMetrics = (campaignId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const getSSEEndpoint = useCallback(() => {
    if (campaignId) {
      return `${CONFIG.hostApi}/campaigns/${campaignId}/insights/stream`;
    }
    return `${CONFIG.hostApi}/campaigns/insights/stream`;
  }, [campaignId]);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const sseEndpoint = getSSEEndpoint();

    try {
      const eventSource = new EventSource(sseEndpoint);
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        dispatch(setSSEConnected(true));
        reconnectAttempts.current = 0;
      };

      eventSource.onmessage = (event) => {
        try {
          const data: RealTimeMetrics = JSON.parse(event.data);
          dispatch(setRealTimeMetrics(data));
        } catch (error) {
          console.error('Error parsing SSE data:', error);
        }
      };

      eventSource.onerror = () => {
        dispatch(setSSEConnected(false));
        eventSource.close();
        eventSourceRef.current = null;

        // Attempt to reconnect with exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          reconnectAttempts.current += 1;

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };
    } catch (error) {
      console.error('Error creating EventSource:', error);
      dispatch(setSSEConnected(false));
    }
  }, [dispatch, getSSEEndpoint]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    dispatch(clearRealTimeMetrics());
  }, [dispatch]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return { connect, disconnect };
};

export default useRealTimeMetrics;
