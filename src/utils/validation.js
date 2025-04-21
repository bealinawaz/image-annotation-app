/**
 * Ensure a value is a string
 * @param {any} value - The value to stringify
 * @param {string} fallback - Optional fallback if value is falsy/undefined
 * @returns {string} The stringified value
 */
export const ensureString = (value, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  return String(value);
};

/**
 * Ensure a value is an object
 * @param {any} value - The value to ensure is an object
 * @returns {Object} The value if it's an object, or an empty object otherwise
 */
export const ensureObject = (value) => {
  if (value === null || value === undefined || typeof value !== 'object') {
    return {};
  }
  return value;
};

/**
 * Ensure a value is an array
 * @param {any} value - The value to ensure is an array 
 * @returns {Array} The value if it's an array, or an empty array otherwise
 */
export const ensureArray = (value) => {
  if (!Array.isArray(value)) {
    return [];
  }
  return value;
};

/**
 * Ensure a value is a number
 * @param {any} value - The value to ensure is a number
 * @param {number} fallback - Optional fallback if value is not a number
 * @returns {number} The value if it's a number, or fallback otherwise
 */
export const ensureNumber = (value, fallback = 0) => {
  if (value === null || value === undefined) return fallback;
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

/**
 * Transform an API response object to ensure its properties are of the expected types
 * @param {Object} item - The API response item
 * @param {Object} schema - Schema defining expected property types
 * @returns {Object} The transformed item with validated properties
 */
export const validateApiItem = (item, schema) => {
  if (!item || typeof item !== 'object') return {};
  
  const result = { ...item };
  
  Object.entries(schema).forEach(([key, type]) => {
    switch (type) {
      case 'string':
        result[key] = ensureString(item[key]);
        break;
      case 'object':
        result[key] = ensureObject(item[key]);
        break;
      case 'array':
        result[key] = ensureArray(item[key]);
        break;
      case 'number':
        result[key] = ensureNumber(item[key]);
        break;
      default:
        // Keep as is for any other type
        break;
    }
  });
  
  return result;
}; 