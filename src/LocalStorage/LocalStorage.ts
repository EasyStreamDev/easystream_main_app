export class LocalStorage {

    /**
     * Checks if the browser supports local storage.
     * @returns true if the local storage is supported; false otherwise.
     */
    public static isSupported(): boolean {
        try {
            // Try to use basic methods of localStorage. 
            localStorage.setItem('__localstorage_support_test__', '');
            localStorage.getItem('__localstorage_support_test__');
            localStorage.removeItem('__localstorage_support_test__');
        } catch(e) {
            // If exception is thrown, then there is problem in local storage support.
            console.warn('LocalStorage Not supported for this browser.');
            return false;
        }

        // local storage is suported.
        return true;
    };

    /**
     * Sets an encoded string item in the local storage.
     * @param key Key of the item to be stored.
     * @param value Value of the item to be stored.
     */
    public static setItem(key: string, value: string): void {
        localStorage.setItem(key, value);
    };

    /**
     * Sets an encoded object item in the local storage.
     * @param key Key of the item to be stored.
     * @param value Value of the item to be stored.
     */
    public static setItemObject(key: string, value: any): void {
        const json = JSON.stringify(value);
        this.setItem(key, json);
    };

    /**
     * Gets the decoded string item from the local storage.
     * @param key Key of the item to be retrieved.
     * @returns String value against the given key.
     */
    public static getItem(key: string): string | null {
        // Check if the value for the key exists in the storage.
        if (localStorage.getItem(key) === null) {
            return null;
        }

        // Get and return the value.
        const value = localStorage.getItem(key);
        return value;
    };

    /**
     * Gets the decoded object item from the local storage.
     * @param key Key of the item to be retrieved.
     * @returns Object of type T against the given key.
     */
    public static getItemObject(key: string): any | null {
        // Parse and return the JSON object.
        const value = this.getItem(key)
        if (value === null) {
            return null
        }
        try {
            return JSON.parse(value) as any;
        } catch(e) {
            return null;
        }
    };

    public static removeItem(key: string): void {
        localStorage.removeItem(key);    
    };

}; // End of class: LocalStorage