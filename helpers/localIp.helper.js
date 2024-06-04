const os = require('os');

const getLocalIP = (interfaceName) => {
  const interfaces = os.networkInterfaces();
  const ifaceList = interfaces[interfaceName];
  
  if (ifaceList) {
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }

  return null;
};

module.exports = { getLocalIP };
