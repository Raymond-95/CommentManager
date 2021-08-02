declare module "react-native-config" {
  interface Env {
    ENV: "DEVELOPMENT" | "STAGING" | "PRODUCTION"
    MOCK_EXAMPLE_API: "NO" | "YES"
    API_BASE_URL: "https://jsonplaceholder.typicode.com"
    SENTRY_DSN: ""
  }

  const Config: Env

  export default Config
}