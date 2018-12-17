const graphqlEndpoint =
  process.env.NODE_ENV === "develop"
    ? "http://localhost:4600/"
    : "http://localhost:4600/";

export class GraphQLClient {
  constructor(options) {
    this.options = options || {};
  }

  request = (query, variables) => {
    return new Promise((resolve, reject) => {
      const { headers, ...others } = this.options;
      const formData = JSON.stringify({
        query,
        variables: variables ? variables : undefined
      });
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: formData,
        ...others
      };
      fetch(graphqlEndpoint, requestOptions)
        .then(response => {
          if (response.ok) {
            return response;
          }
          throw new Error("服务器出错");
        })
        .then(response => response.json())
        .then(res => {
          const { data, code, message } = res;
          if ((data.errors && data.errors.length > 0) || code > 0) {
            throw new Error(message || data.errors[0].message);
          }
          resolve(data);
        })
        .catch(err => {
          console.log("%cRequest error==>", "color:red;font-weight:bold;", err);
          reject(err);
        });
    });
  };
}

export function request(query, variables, originOptions) {
  const options = originOptions;
  if (originOptions.auth) {
    options.headers = {
      ...options.headers,
      Authorization: "Bearer XXXX"
    };
  }
  const client = new GraphQLClient(options);
  return client.request(query, variables);
}
