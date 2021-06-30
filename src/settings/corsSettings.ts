import { CorsOptions } from "cors"

export const corsSettigs: CorsOptions = {
  origin: [
    /\.pedro.dev/,
    "https://pedro.dev",
    /\api.pedro.dev/,
    "https://api.pedro.dev",
    /\.pedroferrari.com/,
    "https://pedroferrari.com",
    /\api.pedroferrari.com/,
    "https://api.pedroferrari.com",
  ],
  credentials: true,
}
