export interface Category {
    readonly _id: string;
    readonly category: string;
    description: string;
    event: Array<Event>;
}

export interface Event {
    name: string;
    operation: string;
    value: number;
}
