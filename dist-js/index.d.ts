/**
 * Provides APIs to create windows, communicate with other windows and manipulate the current window.
 *
 * ## Window events
 *
 * Events can be listened to using `appWindow.listen`:
 * ```typescript
 * import { appWindow } from "@tauri-apps/plugin-window";
 * appWindow.listen("my-window-event", ({ event, payload }) => { });
 * ```
 *
 * @module
 */
import type { Event, EventName, EventCallback, UnlistenFn } from "@tauri-apps/api/event";
declare global {
    interface Window {
        __TAURI_INVOKE__: <T>(cmd: string, args?: unknown) => Promise<T>;
    }
}
type Theme = "light" | "dark";
type TitleBarStyle = "visible" | "transparent" | "overlay";
/**
 * Allows you to retrieve information about a given monitor.
 *
 * @since 2.0.0
 */
interface Monitor {
    /** Human-readable name of the monitor */
    name: string | null;
    /** The monitor's resolution. */
    size: PhysicalSize;
    /** the Top-left corner position of the monitor relative to the larger full screen area. */
    position: PhysicalPosition;
    /** The scale factor that can be used to map physical pixels to logical pixels. */
    scaleFactor: number;
}
/**
 * The payload for the `scaleChange` event.
 *
 * @since 2.0.0
 */
interface ScaleFactorChanged {
    /** The new window scale factor. */
    scaleFactor: number;
    /** The new window size */
    size: PhysicalSize;
}
/** The file drop event types. */
type FileDropEvent = {
    type: "hover";
    paths: string[];
} | {
    type: "drop";
    paths: string[];
} | {
    type: "cancel";
};
/**
 * A size represented in logical pixels.
 *
 * @since 2.0.0
 */
declare class LogicalSize {
    type: string;
    width: number;
    height: number;
    constructor(width: number, height: number);
}
/**
 * A size represented in physical pixels.
 *
 * @since 2.0.0
 */
declare class PhysicalSize {
    type: string;
    width: number;
    height: number;
    constructor(width: number, height: number);
    /**
     * Converts the physical size to a logical one.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const factor = await appWindow.scaleFactor();
     * const size = await appWindow.innerSize();
     * const logical = size.toLogical(factor);
     * ```
     *  */
    toLogical(scaleFactor: number): LogicalSize;
}
/**
 *  A position represented in logical pixels.
 *
 * @since 2.0.0
 */
declare class LogicalPosition {
    type: string;
    x: number;
    y: number;
    constructor(x: number, y: number);
}
/**
 *  A position represented in physical pixels.
 *
 * @since 2.0.0
 */
declare class PhysicalPosition {
    type: string;
    x: number;
    y: number;
    constructor(x: number, y: number);
    /**
     * Converts the physical position to a logical one.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const factor = await appWindow.scaleFactor();
     * const position = await appWindow.innerPosition();
     * const logical = position.toLogical(factor);
     * ```
     * */
    toLogical(scaleFactor: number): LogicalPosition;
}
/** @ignore */
interface WindowDef {
    label: string;
}
/** @ignore */
declare global {
    interface Window {
        __TAURI_METADATA__: {
            __windows: WindowDef[];
            __currentWindow: WindowDef;
        };
    }
}
/**
 * Attention type to request on a window.
 *
 * @since 2.0.0
 */
declare enum UserAttentionType {
    /**
     * #### Platform-specific
     * - **macOS:** Bounces the dock icon until the application is in focus.
     * - **Windows:** Flashes both the window and the taskbar button until the application is in focus.
     */
    Critical = 1,
    /**
     * #### Platform-specific
     * - **macOS:** Bounces the dock icon once.
     * - **Windows:** Flashes the taskbar button until the application is in focus.
     */
    Informational = 2
}
export type CursorIcon = "default" | "crosshair" | "hand" | "arrow" | "move" | "text" | "wait" | "help" | "progress" | "notAllowed" | "contextMenu" | "cell" | "verticalText" | "alias" | "copy" | "noDrop" | "grab" | "grabbing" | "allScroll" | "zoomIn" | "zoomOut" | "eResize" | "nResize" | "neResize" | "nwResize" | "sResize" | "seResize" | "swResize" | "wResize" | "ewResize" | "nsResize" | "neswResize" | "nwseResize" | "colResize" | "rowResize";
/**
 * Get an instance of `WebviewWindow` for the current webview window.
 *
 * @since 2.0.0
 */
declare function getCurrent(): WebviewWindow;
/**
 * Gets a list of instances of `WebviewWindow` for all available webview windows.
 *
 * @since 2.0.0
 */
declare function getAll(): WebviewWindow[];
/** @ignore */
export type WindowLabel = string;
/**
 * A webview window handle allows emitting and listening to events from the backend that are tied to the window.
 *
 * @ignore
 * @since 2.0.0
 */
declare class WebviewWindowHandle {
    /** The window label. It is a unique identifier for the window, can be used to reference it later. */
    label: WindowLabel;
    /** Local event listeners. */
    listeners: Record<string, Array<EventCallback<any>>>;
    constructor(label: WindowLabel);
    /**
     * Listen to an event emitted by the backend that is tied to the webview window.
     *
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const unlisten = await appWindow.listen<string>('state-changed', (event) => {
     *   console.log(`Got error: ${payload}`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    listen<T>(event: EventName, handler: EventCallback<T>): Promise<UnlistenFn>;
    /**
     * Listen to an one-off event emitted by the backend that is tied to the webview window.
     *
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const unlisten = await appWindow.once<null>('initialized', (event) => {
     *   console.log(`Window initialized!`);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param handler Event handler.
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    once<T>(event: string, handler: EventCallback<T>): Promise<UnlistenFn>;
    /**
     * Emits an event to the backend, tied to the webview window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.emit('window-loaded', { loggedIn: true, token: 'authToken' });
     * ```
     *
     * @param event Event name. Must include only alphanumeric characters, `-`, `/`, `:` and `_`.
     * @param payload Event payload.
     */
    emit(event: string, payload?: unknown): Promise<void>;
    /** @ignore */
    _handleTauriEvent<T>(event: string, handler: EventCallback<T>): boolean;
}
/**
 * Manage the current window object.
 *
 * @ignore
 * @since 2.0.0
 */
declare class WindowManager extends WebviewWindowHandle {
    /**
     * The scale factor that can be used to map physical pixels to logical pixels.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const factor = await appWindow.scaleFactor();
     * ```
     *
     * @returns The window's monitor scale factor.
     *
     * @since 2.0.0
     * */
    scaleFactor(): Promise<number>;
    /**
     * The position of the top-left hand corner of the window's client area relative to the top-left hand corner of the desktop.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const position = await appWindow.innerPosition();
     * ```
     *
     * @returns The window's inner position.
     *
     * @since 2.0.0
     *  */
    innerPosition(): Promise<PhysicalPosition>;
    /**
     * The position of the top-left hand corner of the window relative to the top-left hand corner of the desktop.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const position = await appWindow.outerPosition();
     * ```
     *
     * @returns The window's outer position.
     *
     * @since 2.0.0
     *  */
    outerPosition(): Promise<PhysicalPosition>;
    /**
     * The physical size of the window's client area.
     * The client area is the content of the window, excluding the title bar and borders.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const size = await appWindow.innerSize();
     * ```
     *
     * @returns The window's inner size.
     *
     * @since 2.0.0
     */
    innerSize(): Promise<PhysicalSize>;
    /**
     * The physical size of the entire window.
     * These dimensions include the title bar and borders. If you don't want that (and you usually don't), use inner_size instead.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const size = await appWindow.outerSize();
     * ```
     *
     * @returns The window's outer size.
     *
     * @since 2.0.0
     */
    outerSize(): Promise<PhysicalSize>;
    /**
     * Gets the window's current fullscreen state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const fullscreen = await appWindow.isFullscreen();
     * ```
     *
     * @returns Whether the window is in fullscreen mode or not.
     *
     * @since 2.0.0
     *  */
    isFullscreen(): Promise<boolean>;
    /**
     * Gets the window's current minimized state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const minimized = await appWindow.isMinimized();
     * ```
     *
     * @since 2.0.0
     * */
    isMinimized(): Promise<boolean>;
    /**
     * Gets the window's current maximized state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const maximized = await appWindow.isMaximized();
     * ```
     *
     * @returns Whether the window is maximized or not.
     *
     * @since 2.0.0
     * */
    isMaximized(): Promise<boolean>;
    /**
     * Gets the window's current decorated state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const decorated = await appWindow.isDecorated();
     * ```
     *
     * @returns Whether the window is decorated or not.
     *
     * @since 2.0.0
     *  */
    isDecorated(): Promise<boolean>;
    /**
     * Gets the window's current resizable state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const resizable = await appWindow.isResizable();
     * ```
     *
     * @returns Whether the window is resizable or not.
     *
     * @since 2.0.0
     *  */
    isResizable(): Promise<boolean>;
    /**
     * Gets the window's current visible state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const visible = await appWindow.isVisible();
     * ```
     *
     * @returns Whether the window is visible or not.
     *
     * @since 2.0.0
     *  */
    isVisible(): Promise<boolean>;
    /**
     * Gets the window's current title.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const title = await appWindow.title();
     * ```
     *
     * @since 2.0.0
     * */
    title(): Promise<string>;
    /**
     * Gets the window's current theme.
     *
     * #### Platform-specific
     *
     * - **macOS:** Theme was introduced on macOS 10.14. Returns `light` on macOS 10.13 and below.
     *
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * const theme = await appWindow.theme();
     * ```
     *
     * @returns The window theme.
     *
     * @since 2.0.0
     * */
    theme(): Promise<Theme | null>;
    /**
     * Centers the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.center();
     * ```
     *
     * @param resizable
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    center(): Promise<void>;
    /**
     *  Requests user attention to the window, this has no effect if the application
     * is already focused. How requesting for user attention manifests is platform dependent,
     * see `UserAttentionType` for details.
     *
     * Providing `null` will unset the request for user attention. Unsetting the request for
     * user attention might not be done automatically by the WM when the window receives input.
     *
     * #### Platform-specific
     *
     * - **macOS:** `null` has no effect.
     * - **Linux:** Urgency levels have the same effect.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.requestUserAttention();
     * ```
     *
     * @param resizable
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    requestUserAttention(requestType: UserAttentionType | null): Promise<void>;
    /**
     * Updates the window resizable flag.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setResizable(false);
     * ```
     *
     * @param resizable
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setResizable(resizable: boolean): Promise<void>;
    /**
     * Sets the window title.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setTitle('Tauri');
     * ```
     *
     * @param title The new title
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setTitle(title: string): Promise<void>;
    /**
     * Maximizes the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.maximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    maximize(): Promise<void>;
    /**
     * Unmaximizes the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.unmaximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    unmaximize(): Promise<void>;
    /**
     * Toggles the window maximized state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.toggleMaximize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    toggleMaximize(): Promise<void>;
    /**
     * Minimizes the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.minimize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    minimize(): Promise<void>;
    /**
     * Unminimizes the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.unminimize();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    unminimize(): Promise<void>;
    /**
     * Sets the window visibility to true.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.show();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    show(): Promise<void>;
    /**
     * Sets the window visibility to false.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.hide();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    hide(): Promise<void>;
    /**
     * Closes the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.close();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    close(): Promise<void>;
    /**
     * Whether the window should have borders and bars.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setDecorations(false);
     * ```
     *
     * @param decorations Whether the window should have borders and bars.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setDecorations(decorations: boolean): Promise<void>;
    /**
     * Whether or not the window should have shadow.
     *
     * #### Platform-specific
     *
     * - **Windows:**
     *   - `false` has no effect on decorated window, shadows are always ON.
     *   - `true` will make ndecorated window have a 1px white border,
     * and on Windows 11, it will have a rounded corners.
     * - **Linux:** Unsupported.
     *
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setShadow(false);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setShadow(enable: boolean): Promise<void>;
    /**
     * Whether the window should always be on top of other windows.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setAlwaysOnTop(true);
     * ```
     *
     * @param alwaysOnTop Whether the window should always be on top of other windows or not.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setAlwaysOnTop(alwaysOnTop: boolean): Promise<void>;
    /**
     * Prevents the window contents from being captured by other apps.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setContentProtected(true);
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setContentProtected(protected_: boolean): Promise<void>;
    /**
     * Resizes the window with a new inner size.
     * @example
     * ```typescript
     * import { appWindow, LogicalSize } from '@tauri-apps/window';
     * await appWindow.setSize(new LogicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setSize(size: LogicalSize | PhysicalSize): Promise<void>;
    /**
     * Sets the window minimum inner size. If the `size` argument is not provided, the constraint is unset.
     * @example
     * ```typescript
     * import { appWindow, PhysicalSize } from '@tauri-apps/window';
     * await appWindow.setMinSize(new PhysicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size, or `null` to unset the constraint.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setMinSize(size: LogicalSize | PhysicalSize | null | undefined): Promise<void>;
    /**
     * Sets the window maximum inner size. If the `size` argument is undefined, the constraint is unset.
     * @example
     * ```typescript
     * import { appWindow, LogicalSize } from '@tauri-apps/window';
     * await appWindow.setMaxSize(new LogicalSize(600, 500));
     * ```
     *
     * @param size The logical or physical inner size, or `null` to unset the constraint.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setMaxSize(size: LogicalSize | PhysicalSize | null | undefined): Promise<void>;
    /**
     * Sets the window outer position.
     * @example
     * ```typescript
     * import { appWindow, LogicalPosition } from '@tauri-apps/window';
     * await appWindow.setPosition(new LogicalPosition(600, 500));
     * ```
     *
     * @param position The new position, in logical or physical pixels.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setPosition(position: LogicalPosition | PhysicalPosition): Promise<void>;
    /**
     * Sets the window fullscreen state.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setFullscreen(true);
     * ```
     *
     * @param fullscreen Whether the window should go to fullscreen or not.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setFullscreen(fullscreen: boolean): Promise<void>;
    /**
     * Bring the window to front and focus.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setFocus();
     * ```
     *
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setFocus(): Promise<void>;
    /**
     * Sets the window icon.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setIcon('/tauri/awesome.png');
     * ```
     *
     * Note that you need the `icon-ico` or `icon-png` Cargo features to use this API.
     * To enable it, change your Cargo.toml file:
     * ```toml
     * [dependencies]
     * tauri = { version = "...", features = ["...", "icon-png"] }
     * ```
     *
     * @param icon Icon bytes or path to the icon file.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setIcon(icon: string | Uint8Array): Promise<void>;
    /**
     * Whether the window icon should be hidden from the taskbar or not.
     *
     * #### Platform-specific
     *
     * - **macOS:** Unsupported.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setSkipTaskbar(true);
     * ```
     *
     * @param skip true to hide window icon, false to show it.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setSkipTaskbar(skip: boolean): Promise<void>;
    /**
     * Grabs the cursor, preventing it from leaving the window.
     *
     * There's no guarantee that the cursor will be hidden. You should
     * hide it by yourself if you want so.
     *
     * #### Platform-specific
     *
     * - **Linux:** Unsupported.
     * - **macOS:** This locks the cursor in a fixed location, which looks visually awkward.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setCursorGrab(true);
     * ```
     *
     * @param grab `true` to grab the cursor icon, `false` to release it.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setCursorGrab(grab: boolean): Promise<void>;
    /**
     * Modifies the cursor's visibility.
     *
     * #### Platform-specific
     *
     * - **Windows:** The cursor is only hidden within the confines of the window.
     * - **macOS:** The cursor is hidden as long as the window has input focus, even if the cursor is
     *   outside of the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setCursorVisible(false);
     * ```
     *
     * @param visible If `false`, this will hide the cursor. If `true`, this will show the cursor.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setCursorVisible(visible: boolean): Promise<void>;
    /**
     * Modifies the cursor icon of the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setCursorIcon('help');
     * ```
     *
     * @param icon The new cursor icon.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setCursorIcon(icon: CursorIcon): Promise<void>;
    /**
     * Changes the position of the cursor in window coordinates.
     * @example
     * ```typescript
     * import { appWindow, LogicalPosition } from '@tauri-apps/window';
     * await appWindow.setCursorPosition(new LogicalPosition(600, 300));
     * ```
     *
     * @param position The new cursor position.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setCursorPosition(position: LogicalPosition | PhysicalPosition): Promise<void>;
    /**
     * Changes the cursor events behavior.
     *
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.setIgnoreCursorEvents(true);
     * ```
     *
     * @param ignore `true` to ignore the cursor events; `false` to process them as usual.
     * @returns A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    setIgnoreCursorEvents(ignore: boolean): Promise<void>;
    /**
     * Starts dragging the window.
     * @example
     * ```typescript
     * import { appWindow } from '@tauri-apps/window';
     * await appWindow.startDragging();
     * ```
     *
     * @return A promise indicating the success or failure of the operation.
     *
     * @since 2.0.0
     */
    startDragging(): Promise<void>;
    /**
     * Listen to window resize.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onResized(({ payload: size }) => {
     *  console.log('Window resized', size);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onResized(handler: EventCallback<PhysicalSize>): Promise<UnlistenFn>;
    /**
     * Listen to window move.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onMoved(({ payload: position }) => {
     *  console.log('Window moved', position);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onMoved(handler: EventCallback<PhysicalPosition>): Promise<UnlistenFn>;
    /**
     * Listen to window close requested. Emitted when the user requests to closes the window.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * import { confirm } from '@tauri-apps/api/dialog';
     * const unlisten = await appWindow.onCloseRequested(async (event) => {
     *   const confirmed = await confirm('Are you sure?');
     *   if (!confirmed) {
     *     // user did not confirm closing the window; let's prevent it
     *     event.preventDefault();
     *   }
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onCloseRequested(handler: (event: CloseRequestedEvent) => void | Promise<void>): Promise<UnlistenFn>;
    /**
     * Listen to window focus change.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onFocusChanged(({ payload: focused }) => {
     *  console.log('Focus changed, window is focused? ' + focused);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onFocusChanged(handler: EventCallback<boolean>): Promise<UnlistenFn>;
    /**
     * Listen to window scale change. Emitted when the window's scale factor has changed.
     * The following user actions can cause DPI changes:
     * - Changing the display's resolution.
     * - Changing the display's scale factor (e.g. in Control Panel on Windows).
     * - Moving the window to a display with a different scale factor.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onScaleChanged(({ payload }) => {
     *  console.log('Scale changed', payload.scaleFactor, payload.size);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onScaleChanged(handler: EventCallback<ScaleFactorChanged>): Promise<UnlistenFn>;
    /**
     * Listen to the window menu item click. The payload is the item id.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onMenuClicked(({ payload: menuId }) => {
     *  console.log('Menu clicked: ' + menuId);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onMenuClicked(handler: EventCallback<string>): Promise<UnlistenFn>;
    /**
     * Listen to a file drop event.
     * The listener is triggered when the user hovers the selected files on the window,
     * drops the files or cancels the operation.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onFileDropEvent((event) => {
     *  if (event.payload.type === 'hover') {
     *    console.log('User hovering', event.payload.paths);
     *  } else if (event.payload.type === 'drop') {
     *    console.log('User dropped', event.payload.paths);
     *  } else {
     *    console.log('File drop cancelled');
     *  }
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onFileDropEvent(handler: EventCallback<FileDropEvent>): Promise<UnlistenFn>;
    /**
     * Listen to the system theme change.
     *
     * @example
     * ```typescript
     * import { appWindow } from "@tauri-apps/plugin-window";
     * const unlisten = await appWindow.onThemeChanged(({ payload: theme }) => {
     *  console.log('New theme: ' + theme);
     * });
     *
     * // you need to call unlisten if your handler goes out of scope e.g. the component is unmounted
     * unlisten();
     * ```
     *
     * @returns A promise resolving to a function to unlisten to the event.
     * Note that removing the listener is required if your listener goes out of scope e.g. the component is unmounted.
     *
     * @since 2.0.0
     */
    onThemeChanged(handler: EventCallback<Theme>): Promise<UnlistenFn>;
}
/**
 * @since 2.0.0
 */
declare class CloseRequestedEvent {
    /** Event name */
    event: EventName;
    /** The label of the window that emitted this event. */
    windowLabel: string;
    /** Event identifier used to unlisten */
    id: number;
    private _preventDefault;
    constructor(event: Event<null>);
    preventDefault(): void;
    isPreventDefault(): boolean;
}
/**
 * Create new webview windows and get a handle to existing ones.
 *
 * Windows are identified by a *label*  a unique identifier that can be used to reference it later.
 * It may only contain alphanumeric characters `a-zA-Z` plus the following special characters `-`, `/`, `:` and `_`.
 *
 * @example
 * ```typescript
 * // loading embedded asset:
 * const webview = new WebviewWindow('theUniqueLabel', {
 *   url: 'path/to/page.html'
 * });
 * // alternatively, load a remote URL:
 * const webview = new WebviewWindow('theUniqueLabel', {
 *   url: 'https://github.com/tauri-apps/tauri'
 * });
 *
 * webview.once('tauri://created', function () {
 *  // webview window successfully created
 * });
 * webview.once('tauri://error', function (e) {
 *  // an error happened creating the webview window
 * });
 *
 * // emit an event to the backend
 * await webview.emit("some event", "data");
 * // listen to an event from the backend
 * const unlisten = await webview.listen("event name", e => {});
 * unlisten();
 * ```
 *
 * @since 2.0.0
 */
declare class WebviewWindow extends WindowManager {
    /**
     * Creates a new WebviewWindow.
     * @example
     * ```typescript
     * import { WebviewWindow } from '@tauri-apps/window';
     * const webview = new WebviewWindow('my-label', {
     *   url: 'https://github.com/tauri-apps/tauri'
     * });
     * webview.once('tauri://created', function () {
     *  // webview window successfully created
     * });
     * webview.once('tauri://error', function (e) {
     *  // an error happened creating the webview window
     * });
     * ```
     *
     * * @param label The unique webview window label. Must be alphanumeric: `a-zA-Z-/:_`.
     * @returns The WebviewWindow instance to communicate with the webview.
     *
     * @since 2.0.0
     */
    constructor(label: WindowLabel, options?: WindowOptions);
    /**
     * Gets the WebviewWindow for the webview associated with the given label.
     * @example
     * ```typescript
     * import { WebviewWindow } from '@tauri-apps/window';
     * const mainWindow = WebviewWindow.getByLabel('main');
     * ```
     *
     * @param label The webview window label.
     * @returns The WebviewWindow instance to communicate with the webview or null if the webview doesn't exist.
     *
     * @since 2.0.0
     */
    static getByLabel(label: string): WebviewWindow | null;
}
/** The WebviewWindow for the current window. */
declare let appWindow: WebviewWindow;
/**
 * Configuration for the window to create.
 *
 * @since 2.0.0
 */
interface WindowOptions {
    /**
     * Remote URL or local file path to open.
     *
     * - URL such as `https://github.com/tauri-apps` is opened directly on a Tauri window.
     * - data: URL such as `data:text/html,<html>...` is only supported with the `window-data-url` Cargo feature for the `tauri` dependency.
     * - local file path or route such as `/path/to/page.html` or `/users` is appended to the application URL (the devServer URL on development, or `tauri://localhost/` and `https://tauri.localhost/` on production).
     */
    url?: string;
    /** Show window in the center of the screen.. */
    center?: boolean;
    /** The initial vertical position. Only applies if `y` is also set. */
    x?: number;
    /** The initial horizontal position. Only applies if `x` is also set. */
    y?: number;
    /** The initial width. */
    width?: number;
    /** The initial height. */
    height?: number;
    /** The minimum width. Only applies if `minHeight` is also set. */
    minWidth?: number;
    /** The minimum height. Only applies if `minWidth` is also set. */
    minHeight?: number;
    /** The maximum width. Only applies if `maxHeight` is also set. */
    maxWidth?: number;
    /** The maximum height. Only applies if `maxWidth` is also set. */
    maxHeight?: number;
    /** Whether the window is resizable or not. */
    resizable?: boolean;
    /** Window title. */
    title?: string;
    /** Whether the window is in fullscreen mode or not. */
    fullscreen?: boolean;
    /** Whether the window will be initially focused or not. */
    focus?: boolean;
    /**
     * Whether the window is transparent or not.
     * Note that on `macOS` this requires the `macos-private-api` feature flag, enabled under `tauri.conf.json > tauri > macOSPrivateApi`.
     * WARNING: Using private APIs on `macOS` prevents your application from being accepted to the `App Store`.
     */
    transparent?: boolean;
    /** Whether the window should be maximized upon creation or not. */
    maximized?: boolean;
    /** Whether the window should be immediately visible upon creation or not. */
    visible?: boolean;
    /** Whether the window should have borders and bars or not. */
    decorations?: boolean;
    /** Whether the window should always be on top of other windows or not. */
    alwaysOnTop?: boolean;
    /** Prevents the window contents from being captured by other apps. */
    contentProtected?: boolean;
    /** Whether or not the window icon should be added to the taskbar. */
    skipTaskbar?: boolean;
    /**
     *  Whether or not the window has shadow.
     *
     * #### Platform-specific
     *
     * - **Windows:**
     *   - `false` has no effect on decorated window, shadows are always ON.
     *   - `true` will make ndecorated window have a 1px white border,
     * and on Windows 11, it will have a rounded corners.
     * - **Linux:** Unsupported.
     *
     * @since 2.0.0
     */
    shadow?: boolean;
    /**
     * Whether the file drop is enabled or not on the webview. By default it is enabled.
     *
     * Disabling it is required to use drag and drop on the frontend on Windows.
     */
    fileDropEnabled?: boolean;
    /**
     * The initial window theme. Defaults to the system theme.
     *
     * Only implemented on Windows and macOS 10.14+.
     */
    theme?: Theme;
    /**
     * The style of the macOS title bar.
     */
    titleBarStyle?: TitleBarStyle;
    /**
     * If `true`, sets the window title to be hidden on macOS.
     */
    hiddenTitle?: boolean;
    /**
     * Whether clicking an inactive window also clicks through to the webview on macOS.
     */
    acceptFirstMouse?: boolean;
    /**
     * Defines the window [tabbing identifier](https://developer.apple.com/documentation/appkit/nswindow/1644704-tabbingidentifier) on macOS.
     *
     * Windows with the same tabbing identifier will be grouped together.
     * If the tabbing identifier is not set, automatic tabbing will be disabled.
     */
    tabbingIdentifier?: string;
    /**
     * The user agent for the webview.
     */
    userAgent?: string;
}
/**
 * Returns the monitor on which the window currently resides.
 * Returns `null` if current monitor can't be detected.
 * @example
 * ```typescript
 * import { currentMonitor } from '@tauri-apps/window';
 * const monitor = currentMonitor();
 * ```
 *
 * @since 2.0.0
 */
declare function currentMonitor(): Promise<Monitor | null>;
/**
 * Returns the primary monitor of the system.
 * Returns `null` if it can't identify any monitor as a primary one.
 * @example
 * ```typescript
 * import { primaryMonitor } from '@tauri-apps/window';
 * const monitor = primaryMonitor();
 * ```
 *
 * @since 2.0.0
 */
declare function primaryMonitor(): Promise<Monitor | null>;
/**
 * Returns the list of all the monitors available on the system.
 * @example
 * ```typescript
 * import { availableMonitors } from '@tauri-apps/window';
 * const monitors = availableMonitors();
 * ```
 *
 * @since 2.0.0
 */
declare function availableMonitors(): Promise<Monitor[]>;
export { WebviewWindow, WebviewWindowHandle, WindowManager, CloseRequestedEvent, getCurrent, getAll, appWindow, LogicalSize, PhysicalSize, LogicalPosition, PhysicalPosition, UserAttentionType, currentMonitor, primaryMonitor, availableMonitors, };
export type { Theme, TitleBarStyle, Monitor, ScaleFactorChanged, FileDropEvent, WindowOptions, };
