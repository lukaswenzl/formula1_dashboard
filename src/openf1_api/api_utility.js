const API = (path) => {
    return `https://api.openf1.org/v1/${path}`;
  };
  
  const getUrl = (link) => {
    return decodeURI(link.substring(link.lastIndexOf("/") + 1));
  };
  
  export { API, getUrl };