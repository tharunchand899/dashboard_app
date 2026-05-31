import React, { createContext, useState, useEffect, useContext } from 'react';

const BucketListContext = createContext(null);

export const BucketListProvider = ({ children }) => {
  const [bucketList, setBucketList] = useState(() => {
    try {
      const stored = localStorage.getItem('wanderlog_bucketlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [visited, setVisited] = useState(() => {
    try {
      const stored = localStorage.getItem('wanderlog_visited');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('wanderlog_bucketlist', JSON.stringify(bucketList));
  }, [bucketList]);

  useEffect(() => {
    localStorage.setItem('wanderlog_visited', JSON.stringify(visited));
  }, [visited]);

  /**
   * Add a country to the bucket list.
   * @param {Object} country 
   * @returns {Object} { success: boolean, message: string }
   */
  const addToBucketList = (country) => {
    // Check if already in bucket list
    if (bucketList.some(c => c.cca3 === country.cca3)) {
      return { success: false, message: `${country.name.common} is already in your bucket list.` };
    }
    // Check if already in visited list
    if (visited.some(c => c.cca3 === country.cca3)) {
      return { success: false, message: `You have already visited ${country.name.common}.` };
    }

    setBucketList(prev => [...prev, country]);
    return { success: true, message: `${country.name.common} added to your bucket list!` };
  };

  /**
   * Mark a country as visited.
   * @param {Object} country 
   * @returns {Object} { success: boolean, message: string }
   */
  const markAsVisited = (country) => {
    // Check if already in visited list
    if (visited.some(c => c.cca3 === country.cca3)) {
      return { success: false, message: `${country.name.common} is already marked as visited.` };
    }

    // Add to visited
    setVisited(prev => [...prev, country]);

    // Remove from bucket list if it exists there
    setBucketList(prev => prev.filter(c => c.cca3 !== country.cca3));

    return { success: true, message: `${country.name.common} marked as visited!` };
  };

  /**
   * Remove a country from both bucket list and visited lists.
   * @param {string} cca3 
   */
  const removeCountry = (cca3) => {
    setBucketList(prev => prev.filter(c => c.cca3 !== cca3));
    setVisited(prev => prev.filter(c => c.cca3 !== cca3));
  };

  // Helper to check if a country is in bucket list
  const isInBucketList = (cca3) => {
    return bucketList.some(c => c.cca3 === cca3);
  };

  // Helper to check if a country is visited
  const isVisited = (cca3) => {
    return visited.some(c => c.cca3 === cca3);
  };

  return (
    <BucketListContext.Provider value={{
      bucketList,
      visited,
      addToBucketList,
      markAsVisited,
      removeCountry,
      isInBucketList,
      isVisited
    }}>
      {children}
    </BucketListContext.Provider>
  );
};

export const useBucketList = () => {
  const context = useContext(BucketListContext);
  if (!context) {
    throw new Error('useBucketList must be used within a BucketListProvider');
  }
  return context;
};
