const https = require('https');
const ids = [
  '1507003211169-0a1dd7228f2d', '1531123414780-f74242c2b052', '1542178243-bc20204b769f', 
  '1506794778202-cad84cf45f1d', '1544005313-94ddf0286df2', '1438761681033-6461ffad8d80',
  '1551836022-d5d88e9218df', '1533227260875-99d750c3cedb', '1599566150163-29194dcaad36',
  '1531384441138-2736e62e0919', '1548142813-c348350df52b', '1522529599102-193c0d76b5b6',
  '1506277886164-e25aa3f4ef7f', '1524250502761-1ac6f2e30d43', '1552058544-f2b08422138a',
  '1573496359142-b8d87734a5a2', '1554151228-14d9def656e4', '1494790108377-be9c29b29330',
  '1566492031773-4f4e44671857', '1500648767791-00dcc994a43e', '1594744803329-e58b31de8bf5'
];

ids.forEach(id => {
  https.get(`https://unsplash.com/photos/${id}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const match = data.match(/<title>(.*?)<\/title>/);
      console.log(`${id}: ${match ? match[1] : 'Not found'}`);
    });
  });
});
