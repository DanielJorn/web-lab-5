import { token, error, counter } from "../store";
import { get } from "svelte/store";
class RequestHelper {
  constructor() {
    this.API_URL = HTTP_LINK;
  }
  async fetchGraphQL(operationsDoc, operationName, variables) {
    try {
      const result = await fetch(this.API_URL, {
        method: "POST",
        body: JSON.stringify({
          query: operationsDoc,
          variables: variables,
          operationName: operationName,
        }),
        headers: {
          Authorization: `Bearer ${get(token)}`,
        },
      });
      return result.json();
    } catch (e) {
      console.error(e);
      counter.update((n) => n - 1);

      error.set(e.message);
    }
  }

  fetchMyQuery(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyQuery", {});
  }

  async startFetchMyQuery(operationsDoc) {
    counter.update((n) => n + 1);
    const { errors, data } = await this.fetchMyQuery(operationsDoc);
    counter.update((n) => n - 1);

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
      throw new Error(errors[0].message);
    }

    // do something great with this precious data
    return data;
  }

  executeMyMutation(operationsDoc) {
    return this.fetchGraphQL(operationsDoc, "MyMutation", {});
  }

  async startExecuteMyMutation(operationsDoc) {
    counter.update((n) => n + 1);
    const { errors, data } = await this.executeMyMutation(operationsDoc);
    counter.update((n) => n - 1);

    if (errors) {
      // handle those errors like a pro
      console.error(errors);
      throw new Error(errors[0].message);
    }

    // do something great with this precious data
    console.log(data);
    return data;
  }
}

export default new RequestHelper();
