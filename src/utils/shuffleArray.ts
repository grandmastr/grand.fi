/**
 * Array Shuffling Utility
 * 
 * This module provides a utility for randomly shuffling arrays using the Fisher-Yates algorithm.
 * The algorithm provides unbiased, efficient shuffling with O(n) time complexity.
 * 
 * @module Utils/Array
 */

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * 
 * Creates a new array with the same elements as the input array but in a random order.
 * The original array remains unchanged (pure function).
 * 
 * @template T - The type of elements in the array
 * @param {T[]} array - The array to be shuffled
 * @returns {T[]} A new array with the same elements in random order
 */
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default shuffleArray;
