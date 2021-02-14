const axios = require('axios').default;

async function getAPIClient(idToken) {
  const axiosClient = await axios.create({
    headers: {
      'Content-Type': 'application/json',
      'Authorization': idToken,
    },
  });

  return axiosClient;
}

module.exports = getAPIClient;
