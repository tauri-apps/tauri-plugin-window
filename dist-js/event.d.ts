declare global {
    interface Window {
        __TAURI_INVOKE__: <T>(cmd: string, args?: unknown) => Promise<T>;
        __TAURI__: {
            transformCallback: <T>(cb: (payload: T) => void) => number;
        };
    }
}
export interface Event<T> {
    /** Event name */
    event: string;
    /** The label of the window that emitted this event. */
    windowLabel: string;
    /** Event identifier used to unlisten */
    id: number;
    /** Event payload */
    payload: T;
}
export type EventCallback<T> = (event: Event<T>) => void;
export type UnlistenFn = () => void;
/**
 * Emits an event to the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param [windowLabel] The label of the window to which the event is sent, if null/undefined the event will be sent to all windows
 * @param [payload] Event payload
 * @returns
 */
declare function emit(event: string, windowLabel?: string, payload?: unknown): Promise<void>;
/**
 * Listen to an event from the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param handler Event handler callback.
 * @return A promise resolving to a function to unlisten to the event.
 */
declare function listen<T>(event: string, windowLabel: string | null, handler: EventCallback<T>): Promise<UnlistenFn>;
/**
 * Listen to an one-off event from the backend.
 *
 * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
 * @param handler Event handler callback.
 * @returns A promise resolving to a function to unlisten to the event.
 */
declare function once<T>(event: string, windowLabel: string | null, handler: EventCallback<T>): Promise<UnlistenFn>;
export { emit, listen, once };
