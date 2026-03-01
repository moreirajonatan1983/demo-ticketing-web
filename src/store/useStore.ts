import { create } from 'zustand';

// ── Helper: construye los headers de autenticación ──────────────
const API_KEY = import.meta.env.VITE_API_KEY || 'dev-local-key';

/** Headers para endpoints públicos (solo necesitan API Key) */
const publicHeaders = () => ({
    'Content-Type': 'application/json',
    'x-api-key': API_KEY,
});

/** Headers para endpoints protegidos (API Key + JWT del usuario logueado) */
const authHeaders = () => {
    const raw = localStorage.getItem('auth_user');
    const idToken = raw ? JSON.parse(raw).idToken : null;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
    };
    if (idToken) headers['Authorization'] = `Bearer ${idToken}`;
    return headers;
};
// ────────────────────────────────────────────────────────────────

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

    // Auth Context
    user: { id: string; name?: string; email: string; idToken?: string } | null;
    isAuthenticated: boolean;
    login: (email: string) => void;
    loginWithCognito: (user: { id: string; name: string; email: string; idToken: string }) => void;
    logout: () => void;

    // Purchase Context
    checkoutProcessing: boolean;
    checkoutConfirmed: boolean;
    checkoutRejected: boolean;       // W-02: pago rechazado
    checkoutError: string | null;
    sagaExecutionArn: string | null;
    processCheckout: (eventId: string, seats: string[], paymentMethod?: string) => Promise<void>;
    resetCheckout: () => void;
}

// ── Datos de ejemplo para desarrollo local ──────────────────────
const MOCK_EVENTS: EventData[] = [
    {
        id: '1',
        title: 'COLDPLAY - Music of the Spheres',
        date: 'Oct 15, 2026',
        venue: 'Estadio Nacional',
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80',
        status: 'Sold Out',
    },
    {
        id: '2',
        title: 'The Weeknd - After Hours',
        date: 'Nov 02, 2026',
        venue: 'Movistar Arena',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80',
        status: 'Últimas Entradas',
    },
    {
        id: '3',
        title: 'Dua Lipa - Radical Optimism',
        date: 'Dec 10, 2026',
        venue: 'Estadio Bicentenario',
        image: 'https://images.unsplash.com/photo-1540039155732-6761b54cb111?w=800&auto=format&fit=crop&q=80',
        status: 'Disponible',
    },
];

// Shows de ejemplo por evento (IDs alineados con backend real)
const MOCK_SHOWS: Record<string, ShowData[]> = {
    '1': [
        { id: 'show-1-a', event_id: '1', date: 'Oct 15, 2026', time: '20:00', status: 'available' },
        { id: 'show-1-b', event_id: '1', date: 'Oct 16, 2026', time: '19:00', status: 'available' },
    ],
    '2': [
        { id: 'show-2-a', event_id: '2', date: 'Nov 02, 2026', time: '21:00', status: 'available' },
        { id: 'show-2-b', event_id: '2', date: 'Nov 03, 2026', time: '20:00', status: 'available' },
    ],
    '3': [
        { id: 'show-3-a', event_id: '3', date: 'Dec 10, 2026', time: '21:00', status: 'available' },
        { id: 'show-3-b', event_id: '3', date: 'Dec 11, 2026', time: '19:00', status: 'available' },
    ],
};
// ────────────────────────────────────────────────────────────────

export const useStore = create<StoreState>((set, get) => ({
    events: [],
    eventsFetched: false,
    fetchEvents: async () => {
        if (get().eventsFetched) return;
        try {
            const res = await fetch('http://localhost:3000/events', { headers: publicHeaders() });
            if (!res.ok) throw new Error('API not available');
            const data = await res.json();
            const formattedData = data.map((ev: any) => {
                if (!ev.image || !ev.image.startsWith('http')) {
                    const fallbackImages = [
                        'https://images.unsplash.com/photo-1540039155732-6761b54cb111?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80',
                        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80'
                    ];
                    const idx = [...ev.id.toString()].reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackImages.length;
                    ev.image = fallbackImages[idx];
                }
                if (ev.date && ev.date.includes('Octubre')) ev.date = 'Oct 15, 2026';
                if (ev.date && ev.date.includes('Noviembre')) ev.date = 'Nov 02, 2026';
                if (ev.date && ev.date.includes('Diciembre')) ev.date = 'Dec 10, 2026';
                return ev;
            });
            set({ events: formattedData, eventsFetched: true });
        } catch (err) {
            console.warn('[DEV] Backend no disponible — cargando eventos de ejemplo locales.');
            set({ events: MOCK_EVENTS, eventsFetched: true });
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
            const res = await fetch(`http://localhost:3000/events/${id}`, { headers: publicHeaders() });
            const ev = await res.json();
            if (!ev.image || !ev.image.startsWith('http')) {
                const fallbackImages = [
                    'https://images.unsplash.com/photo-1540039155732-6761b54cb111?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop&q=80',
                    'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&auto=format&fit=crop&q=80'
                ];
                const idx = [...ev.id.toString()].reduce((acc, char) => acc + char.charCodeAt(0), 0) % fallbackImages.length;
                ev.image = fallbackImages[idx];
            }
            if (ev.date && ev.date.includes('Octubre')) ev.date = 'Oct 15, 2026';
            if (ev.date && ev.date.includes('Noviembre')) ev.date = 'Nov 02, 2026';
            if (ev.date && ev.date.includes('Diciembre')) ev.date = 'Dec 10, 2026';
            set({ selectedEvent: ev });
        } catch (err) {
            console.error(err);
        }
    },

    shows: [],
    showsFetchedForEventId: null,
    fetchShows: async (eventId: string) => {
        if (get().showsFetchedForEventId === eventId) return;
        try {
            const res = await fetch(`http://localhost:3007/events/${eventId}/shows`, { headers: publicHeaders() });
            if (!res.ok) throw new Error('Shows API not available');
            const data = await res.json();
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Empty shows from backend");
            }
            set({ shows: data, showsFetchedForEventId: eventId });
        } catch (err) {
            // Fallback: usar funciones mock si el backend falla o devuelve vacío
            const mockShows = MOCK_SHOWS[eventId] ?? [
                { id: `show-${eventId}-mock1`, event_id: eventId, date: 'Oct 15, 2026', time: '20:00', status: 'available' },
                { id: `show-${eventId}-mock2`, event_id: eventId, date: 'Oct 16, 2026', time: '19:00', status: 'available' },
            ];
            console.warn(`[DEV] Shows backend sin datos — inyectando ${mockShows.length} funciones mock para el evento ${eventId}.`);
            set({ shows: mockShows, showsFetchedForEventId: eventId });
        }
    },

    seatsGrid: [],
    gridFetchedForEventId: null,
    fetchSeats: async (eventId: string) => {
        if (get().gridFetchedForEventId === eventId) return; // Prevent continuous over-fetching
        try {
            const res = await fetch(`http://localhost:3005/events/${eventId}/seats`, { headers: publicHeaders() });
            const data = await res.json();

            // Handle case where DynamoDB returns empty (because seat tables are not seeded)
            if (!Array.isArray(data) || data.length === 0) {
                throw new Error("Empty seats from backend");
            }

            const rowsObj: Record<string, any[]> = {};
            data.forEach((seat: any) => {
                const row = seat.row || 'A';
                if (!rowsObj[row]) rowsObj[row] = [];
                rowsObj[row].push(seat);
            });
            const sortedRows = Object.keys(rowsObj).sort().map(r => rowsObj[r].sort((a: any, b: any) => a.number - b.number));
            set({ seatsGrid: sortedRows, gridFetchedForEventId: eventId });
        } catch (err) {
            console.warn('[DEV] Backend/Seats vacío o no disponible — cargando asientos mock.');

            // Fallback mock seats
            const mockData: any[] = [];
            const rows = ['A', 'B', 'C', 'D', 'E'];
            rows.forEach(row => {
                for (let i = 1; i <= 12; i++) {
                    mockData.push({
                        id: `${row}${i}`,
                        row,
                        number: i,
                        status: Math.random() > 0.85 ? 'occupied' : 'available'
                    });
                }
            });

            const rowsObj: Record<string, any[]> = {};
            mockData.forEach((seat: any) => {
                if (!rowsObj[seat.row]) rowsObj[seat.row] = [];
                rowsObj[seat.row].push(seat);
            });
            const sortedRows = Object.keys(rowsObj).sort().map(r => rowsObj[r].sort((a: any, b: any) => a.number - b.number));
            set({ seatsGrid: sortedRows, gridFetchedForEventId: eventId });
        }
    },

    myTickets: [],
    ticketsFetched: false,
    fetchMyTickets: async () => {
        if (get().ticketsFetched) return;
        try {
            const res = await fetch('http://localhost:3006/tickets/me?userId=mock_user', { headers: authHeaders() });
            const data = await res.json();
            set({ myTickets: data, ticketsFetched: true });
        } catch (err) {
            console.error(err);
        }
    },

    // Auth
    user: localStorage.getItem('auth_user') ? JSON.parse(localStorage.getItem('auth_user')!) : null,
    isAuthenticated: !!localStorage.getItem('auth_user'),
    login: (email: string) => {
        const user = { id: 'mock-user-123', email };
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    loginWithCognito: (userData: { id: string; name: string; email: string; idToken: string }) => {
        const user = { id: userData.id, name: userData.name, email: userData.email, idToken: userData.idToken };
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('auth_user');
        sessionStorage.removeItem('id_token');
        sessionStorage.removeItem('access_token');
        set({ user: null, isAuthenticated: false, myTickets: [], ticketsFetched: false });
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
                    ...authHeaders(),                           // x-api-key + Authorization JWT
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
