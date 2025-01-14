const EntityMetadataCache = (() => {
    const MAX_STORAGE_BYTES = 5120 * 1024; // 5MB storage limit
    const METADATA_TTL_MS = 5 * 24 * 60 * 60 * 1000; // 5 days in milliseconds

    async function getCurrentStorageUsage() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.getBytesInUse((bytes) => {
                if (chrome.runtime.lastError)
                    return reject(chrome.runtime.lastError);
                resolve(bytes);
            });
        });
    }

    async function getAllStorageData() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(["cache"], (result) => {
                if (chrome.runtime.lastError)
                    return reject(chrome.runtime.lastError);
                resolve(result.cache || {});
            });
        });
    }

    function getLeastRecentlyUsedOrigin(storageData) {
        let leastUsedOrigin = null;
        let oldestTimestamp = Infinity;

        for (const [origin, { timestamp }] of Object.entries(storageData)) {
            if (timestamp < oldestTimestamp) {
                oldestTimestamp = timestamp;
                leastUsedOrigin = origin;
            }
        }
        return leastUsedOrigin;
    }

    async function setMetadata(origin, metadata) {
        const newEntry = { metadata, timestamp: Date.now() };
        const newEntrySize = new TextEncoder().encode(
            JSON.stringify(newEntry)
        ).length;

        let storageData = await getAllStorageData();
        let currentUsage = await getCurrentStorageUsage();

        // Check if the new entry fits in the remaining space
        while (currentUsage + newEntrySize > MAX_STORAGE_BYTES) {
            const leastUsedOrigin = getLeastRecentlyUsedOrigin(storageData);
            if (!leastUsedOrigin) {
                throw new Error(
                    "Storage limit exceeded, and no data to evict."
                );
            }

            const entrySize = new TextEncoder().encode(
                JSON.stringify(storageData[leastUsedOrigin])
            ).length;
            delete storageData[leastUsedOrigin];
            currentUsage -= entrySize;
        }

        // Add the new metadata
        storageData[origin] = newEntry;
        await chrome.storage.local.set({ cache: storageData });
    }

    async function getLastRefreshDate(origin) {
        const storageData = await new Promise((resolve, reject) => {
            chrome.storage.local.get(["cache"], (result) => {
                if (chrome.runtime.lastError)
                    return reject(chrome.runtime.lastError);
                resolve(result.cache || {});
            });
        });

        if (storageData[origin]) {
            return new Date(storageData[origin].timestamp);
        }
        return null;
    }

    async function getMetadata(origin) {
        const storageData = await getAllStorageData();
        if (storageData[origin]) {
            const { metadata, timestamp } = storageData[origin];

            // Check if the metadata is stale
            if (Date.now() - timestamp > METADATA_TTL_MS) {
                // Remove stale metadata
                delete storageData[origin];
                await chrome.storage.local.set({ cache: storageData });
                return null;
            }

            // Update timestamp to mark as recently used
            storageData[origin].timestamp = Date.now();
            await chrome.storage.local.set({ cache: storageData });
            return metadata;
        }
        return null; // Not found
    }

    async function removeMetadata(origin) {
        const storageData = await getAllStorageData();
        if (storageData[origin]) {
            delete storageData[origin];
            await chrome.storage.local.set({ cache: storageData });
        }
    }

    async function clearCache() {
        await chrome.storage.local.set({ cache: {} });
    }

    return {
        setMetadata,
        getMetadata,
        removeMetadata,
        clearCache,
        getLastRefreshDate,
    };
})();
