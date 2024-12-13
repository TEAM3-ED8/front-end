// import axios from 'axios';

// const API_KEY = import.meta.env.VITE_API_KEY;
// const BASE_URL = import.meta.env.VITE_BASE_URL;

// export const fetchWeather = async () => {
//   const options = {
//     method: 'GET',
//     url: BASE_URL,
//     params: {
//       access_key: API_KEY,
//       query: 'North Pole',
//       units: 'm',
//       lang: 'en'
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log('Weather data:', response.data);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching weather:', error);
//     throw error;
//   }
// };
