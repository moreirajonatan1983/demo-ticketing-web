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

interface StoreState {
    events: EventData[];
    eventsFetched: boolean;
    fetchEvents: () => Promise<void>;

    selectedEvent: EventData | null;
    fetchEventDetails: (id: string) => Promise<void>;

    seatsGrid: any[][];
    gridFetchedForEventId: string | null;
    fetchSeats: (eventId: string) => Promise<void>;

    myTickets: TicketData[];
    ticketsFetched: boolean;
    fetchMyTickets: () => Promise<void>;

    // Purchase Context
    checkoutProcessing: boolean;
    checkoutConfirmed: boolean;
    processCheckout: (eventId: string, seats: string[]) => Promise<void>;
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
    processCheckout: async (eventId: string, seats: string[]) => {
        set({ checkoutProcessing: true });
        try {
            const res = await fetch('http://localhost:3004/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    event_id: eventId,
                    seats: seats,
                    method: "CREDIT_CARD"
                })
            });
            if (!res.ok) throw new Error("Processing failed");
            set({ checkoutProcessing: false, checkoutConfirmed: true });

            // Invalidate tickets fetch cache
            set({ ticketsFetched: false });
        } catch (err) {
            console.error(err);
            set({ checkoutProcessing: false });
        }
    },
    resetCheckout: () => set({ checkoutProcessing: false, checkoutConfirmed: false })
}));
