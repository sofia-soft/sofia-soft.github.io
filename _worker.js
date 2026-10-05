export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      return env.ASSETS.fetch(
        new Request(new URL("/404.html", request.url))
      );
    }

    return response;
  }
};
