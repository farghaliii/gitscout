import "core-js/stable";
exports.handler = async (event, context) => {
  try {
    // Retrieve the access token from the environment variable
    const accessToken = process.env.GITHUB_ACCESS_TOKEN;

    // Check if the token exists
    if (!accessToken) {
      throw new Error("GITHUB_ACCESS_TOKEN environment variable is not set");
    }

    // Return the access token in the response
    return {
      statusCode: 200,
      body: JSON.stringify({ accessToken }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to retrieve access token" }),
    };
  }
};
