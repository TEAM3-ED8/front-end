import axios from 'axios';

const GPS_API_URL = import.meta.env.VITE_GPS_API_URL;
const ROUTE_API_URL = import.meta.env.VITE_ROUTE_API_URL;
const API_URL = import.meta.env.VITE_PROD_API_URL;

// Autocomplete suggestions
export const getAutocompleteSuggestions = async (query) => {
  const response = await axios.get(`${GPS_API_URL}/search`, {
    params: {
      format: 'json',
      q: query,
      'accept-language': 'en,es',
      limit: 5,
      addressdetails: 1,
      namedetails: 1,
    },
  });
  return response.data;
};

// Update the searchLocation function to include more parameters
export const searchLocation = async ({ query }) => {
  try {
    const response = await axios.get(`${GPS_API_URL}/search`, {
      params: {
        format: 'json',
        q: query,
        'accept-language': 'en,es',
        limit: 1,
        addressdetails: 1,
        namedetails: 1,
      },
    });


    if (response.data && Array.isArray(response.data) && response.data.length > 0) {
      const location = response.data[0];
      if (location.lat && location.lon) {
        return [{
          display_name: location.display_name,
          lat: location.lat,
          lng: location.lon,
        }];
      } else {
        throw new Error('Invalid location data received from the API');
      }
    } else {
      console.log('No results found for query:', query);
      return [];
    }
  } catch (error) {
    console.error('Error searching location:', error);
    throw new Error('Error searching location. Please try again.');
  }
};

export const getRoute = async (start, end) => {
  try {
    const url = `${ROUTE_API_URL}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching route:', error);
    if (error.response && error.response.data) {
      const { code, message } = error.response.data;
      if (code === 'NoRoute') {
        throw new Error('No route found between the selected points. The destination might be unreachable by road.');
      }
      throw new Error(message || 'An error occurred while calculating the route.');
    }
    throw new Error('An error occurred while calculating the route. Please try again.');
  }
};

export const saveLocation = async (location) => {
  try {
    const response = await axios.post(`${API_URL}api/address`, {
      display_name: location.display_name,
      lat: location.lat,
      lng: location.lng,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error saving location');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
}

export const getSearchHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}api/address`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error fetching search history');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

export const getByIdAddress = async (id) => {
  try {
    const response = await axios.get(`${API_URL}api/address/${id}`);
    const { error, message, data } = response.data;
    
    if (error) {
      throw new Error(message || 'Error fetching address');
    }
    
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid response data structure');
    }
    
    if (!data.lat || !data.lng || !data.display_name) {
      console.error('Missing required fields in address data:', data);
      throw new Error('Invalid address data: missing required fields');
    }
    
    return {
      id: data.id,
      lat: data.lat,
      lng: data.lng,
      display_name: data.display_name
    };
  } catch (error) {
    console.error('Error fetching address by ID:', error);
    throw error; // Re-throw the error to be handled by the calling function
  }
};

export const deleteLocation = async (locationToDelete) => {
  try {
    const response = await axios.delete(`${API_URL}api/address/${locationToDelete.id}`);
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Error deleting location');
    } else if (error.request) {
      throw new Error('No response received from server');
    } else {
      throw new Error('Error setting up the request');
    }
  }
};

