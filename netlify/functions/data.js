// This file executes instantly in the cloud when someone calls your API
export const handler = async (event) => {
  const type = event.queryStringParameters.type;
  const id = event.queryStringParameters.id;

  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET"
  };

  if (type !== 'user') {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Use type=user" }) };
  }

  // Generate 10,000 dummy users in memory
  const users = [];
  const departments = ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];
  for (let i = 1; i <= 10000; i++) {
    users.push({
      id: i,
      name: `User ${i}`,
      username: `user_${i}`,
      email: `user${i}@example.com`,
      department: departments[i % departments.length]
    });
  }

  if (id === 'all' || !id) {
    return { statusCode: 200, headers, body: JSON.stringify(users) };
  } 
  
  const userId = parseInt(id, 10);
  const singleUser = users.find(u => u.id === userId);

  if (singleUser) {
    return { statusCode: 200, headers, body: JSON.stringify(singleUser) };
  } else {
    return { statusCode: 404, headers, body: JSON.stringify({ error: `User ${id} missing` }) };
  }
};