const graphqlEndpoint = "http://localhost:4600/";

export class GraphQLClient {
  constructor(options) {
    this.options = options || {};
  }

  request = (query, variables) => {
    return new Promise((resolve, reject) => {
      const { header, ...others } = this.options;
      const formData = JSON.stringify({
        query,
        variables: variables ? variables : undefined
      });
      const options = {
        url: graphqlEndpoint,
        method: "POST",
        header: { "Content-Type": "application/json", ...header },
        data: formData,
        ...others
      };

      const originSuccess = options["success"];
      const originFail = options["fail"];
      const originComplete = options["complete"];

      options["success"] = res => {
        const { statusCode } = res;
        const { data, code, message } = res.data;
        if ((data.errors && data.errors.length > 0) || code > 0) {
          reject(new Error(message || data.errors[0].message));
        }
        originSuccess && originSuccess(data);
        resolve(data);
      };
      options["fail"] = res => {
        originFail && originFail(res);
        reject(res);
      };

      options["complete"] = res => {
        originComplete && originComplete(res);
      };

      wx.request(options);
    });
  };
}

export default function request(query, variables, originOptions) {
  const options = originOptions;
  if (originOptions.auth) {
    options.header = {
      ...options.header,
      Authorization: "Bearer XXX"
    };
  }
  const client = new GraphQLClient(options);

  return client.request(query, variables);
}
