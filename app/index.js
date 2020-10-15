require('dotenv').config();
const alma = require('almarestapi-lib');
const { responses } = require('./utils');
const { parse }       = require('querystring');

let groups;
try {
  groups = process.env.EZPROXY_GROUP_MAPPING && JSON.parse(process.env.EZPROXY_GROUP_MAPPING);
} catch(e) {
  console.error('Could not parse groups', e)
}

exports.handler = async (event, context) => {
  let response;
  const { path, method } = event.requestContext.http;
  if (method == 'POST') {
    const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString() : event.body;
    const { user, pass } = parse(body);
    try {
      await alma.postp(`/users/${user}?op=auth&password=${pass}`, null);
      let resp = await alma.getp(`/users/${user}`);
      const usergroup = resp.user_group.value
      response = '+VALID\nezproxy_group=' 
      if (groups) {
        const ezproxyGroup = groups && Object.entries(groups).find(([k,v])=>v.includes(usergroup) || v.includes('*'));
        if (ezproxyGroup) response += ezproxyGroup[0].replace(/ /, '+');
      }
    } catch(e) {
      console.error('e', e);
      return responses.error(e.message);
    }
  } else {
    response = 'EZproxy Alma Authenticator'
  }
  response = responses.success(response);
  return response;
};
