import { create } from 'zustand';

export interface EventData {
    id: string;
    title: string;
    date: string;
    venue: string;
    image: string;
    status: string;
}

export interface TicketData {
    id: string;
    event_id: string;
    user_id: string;
    purchase_date: string;
    status: string;
    seats: string[];
    total_paid: number;
}

export interface ShowData {
    id: string;
    event_id: string;
    date: string;
    time: string;
    status: string;
}


interface StoreState {
    events: EventData[];
    eventsFetched: boolean;
    fetchEvents: () => Promise<void>;

    selectedEvent: EventData | null;
    fetchEventDetails: (id: string) => Promise<void>;

    shows: ShowData[];
    showsFetchedForEventId: string | null;
    fetchShows: (eventId: string) => Promise<void>;

    seatsGrid: any[][];
    gridFetchedForEventId: string | null;
    fetchSeats: (eventId: string) => Promise<void>;

    myTickets: TicketData[];
    ticketsFetched: boolean;
    fetchMyTickets: () => Promise<void>;

    // Purchase Context
    checkoutProcessing: boolean;
    checkoutConfirmed: boolean;
    checkoutRejected: boolean;       // W-02: pago rechazado
    checkoutError: string | null;
    sagaExecutionArn: string | null;
    processCheckout: (eventId: string, seats: string[], paymentMethod?: string) => Promise<void>;
    resetCheckout: () => void;
}

export const useStore = create<StoreState>((set, get) => ({
    events: [],
    eventsFetched: false,
    fetchEvents: async () => {
        if (get().eventsFetched) return;
        try {
            const res = await fetch('http://localhost:3000/events');
            const data = await res.json();
            set({ events: data, eventsFetched: true });
        } catch (err) {
            console.error(err);
        }
    },

    selectedEvent: null,
    fetchEventDetails: async (id: string) => {
        // First check in cache
        const cache = get().events.find(e => String(e.id) === id);
        if (cache) {
            set({ selectedEvent: cache });
            return;
        }
        try {
            const res = await fetch(`http://localhost:3000/events/${id}`);
            const data = await res.json();
            set({ selectedEvent: data });
        } catch (err) {
            console.error(err);
        }
    },

    shows: [],
    showsFetchedForEventId: null,
    fetchShows: async (eventId: string) => {
        if (get().showsFetchedForEventId === eventId) return;
        try {
            const res = await fetch(`http://localhost:3007/events/${eventId}/shows`);
            const data = await res.json();
            set({ shows: data, showsFetchedForEventId: eventId });
        } catch (err) {
            console.error(err);
        }
    },

    seatsGrid: [],
    gridFetchedForEventId: null,
    fetchSeats: async (eventId: string) => {
        if (get().gridFetchedForEventId === eventId) return; // Prevent continuous over-fetching
        try {
            const res = await fetch(`http://localhost:3005/events/${eventId}/seats`);
            const data = await res.json();
            const rowsObj: Record<string, any[]> = {};
            data.forEach((seat: any) => {
                if (!rowsObj[seat.row]) rowsObj[seat.row] = [];
                rowsObj[seat.row].push(seat);
            });
            const sortedRows = Object.keys(rowsObj).sort().map(r => rowsObj[r].sort((a: any, b: any) => a.number - b.number));
            set({ seatsGrid: sortedRows, gridFetchedForEventId: eventId });
        } catch (err) {
            console.error(err);
        }
    },

    myTickets: [],
    ticketsFetched: false,
    fetchMyTickets: async () => {
        if (get().ticketsFetched) return;
        try {
            const res = await fetch('http://localhost:3006/tickets/me?userId=mock_user');
            const data = await res.json();
            set({ myTickets: data, ticketsFetched: true });
        } catch (err) {
            console.error(err);
        }
    },

    checkoutProcessing: false,
    checkoutConfirmed: false,
    checkoutRejected: false,
    checkoutError: null,
    sagaExecutionArn: null,

    // B-10: Trigger SAGA via Step Functions StartExecution instead of calling checkout-lambda directly
    processCheckout: async (eventId: string, seats: string[], paymentMethod = 'CREDIT_CARD') => {
        set({ checkoutProcessing: true, checkoutConfirmed: false, checkoutRejected: false, checkoutError: null });
        try {
            const STEP_FUNCTIONS_ENDPOINT = 'http://localhost:4566';
            const STATE_MACHINE_ARN = 'arn:aws:states:us-east-1:000000000000:stateMachine:checkout-saga';

            // Build the SAGA input payload
            const sagaInput = {
                seats: seats.map(seatId => ({ eventId, seatId })),
                paymentPayload: {
                    event_id: eventId,
                    seats,
                    method: paymentMethod
                },
                ticketPayload: {
                    id: `TKT-${Date.now()}`,
                    user_id: 'mock-user-123',
                    event_id: eventId,
                    event_name: get().selectedEvent?.title || 'Evento',
                    date: get().selectedEvent?.date || '',
                    location: get().selectedEvent?.venue || '',
                    sector: 'Campo',
                    status: 'PAID'
                }
            };

            // StartExecution in LocalStack Step Functions
            const startRes = await fetch(`${STEP_FUNCTIONS_ENDPOINT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-amz-json-1.0',
                    'X-Amz-Target': 'AWSStepFunctions.StartExecution'
                },
                body: JSON.stringify({
                    stateMachineArn: STATE_MACHINE_ARN,
                    input: JSON.stringify(sagaInput)
                })
            });

            if (!startRes.ok) throw new Error('Failed to start SAGA execution');
            const { executionArn } = await startRes.json();
            set({ sagaExecutionArn: executionArn });

            // Poll DescribeExecution until SUCCEEDED or FAILED
            let status = 'RUNNING';
            let attempts = 0;
            while (status === 'RUNNING' && attempts < 30) {
                await new Promise(r => setTimeout(r, 1000));
                const describeRes = await fetch(`${STEP_FUNCTIONS_ENDPOINT}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-amz-json-1.0',
                        'X-Amz-Target': 'AWSStepFunctions.DescribeExecution'
                    },
                    body: JSON.stringify({ executionArn })
                });
                const execution = await describeRes.json();
                status = execution.status;
                attempts++;
            }

            if (status === 'SUCCEEDED') {
                set({ checkoutProcessing: false, checkoutConfirmed: true, ticketsFetched: false });
            } else {
                set({ checkoutProcessing: false, checkoutRejected: true, checkoutError: 'Pago rechazado o asientos no disponibles' });
            }
        } catch (err) {
            console.error('[SAGA] Error executing checkout SAGA:', err);
            set({ checkoutProcessing: false, checkoutError: String(err) });
        }
    },

    resetCheckout: () => set({ checkoutProcessing: false, checkoutConfirmed: false, checkoutRejected: false, checkoutError: null, sagaExecutionArn: null })
}));
