import axios from 'axios';

const GET = async (url) => {
  console.log('good');
  const response =  await axios.get(url).then(res => res.data);
  return await response;
};

const POST = async (url, data) => {
  console.log('bad');
  const response =  await axios.post(url, { data }).then(res => res.data);
  return await response;
};

const connection = {
  get(url) {
    return GET(url);
  },
  post(url, data) {
    return POST(url, data);
  }
};

export default connection;
