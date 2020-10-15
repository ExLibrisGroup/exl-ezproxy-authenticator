const responses = {
  success: body => ({ 
    statusCode: 200, 
    headers: { 'Content-type': 'text/plain' },
    body: body
  }),
  unauthorized: () => ({ 
    statusCode: 401, 
    headers: { 'Content-type': 'text/plain' },
    body: 'Unauthorized'
  }),
  notfound: () => ({ statusCode: 404, body: JSON.stringify('Not Found') }),
  error: msg => ({ 
    statusCode: 400, 
    headers: { 'Content-type': 'text/plain' },
    body: msg
  }),
}

module.exports = { responses };