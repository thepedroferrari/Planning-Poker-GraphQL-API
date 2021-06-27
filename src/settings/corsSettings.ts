import { CorsOptions } from "cors"

export const corsSettigs: CorsOptions = {
  origin: [/\.pedro.dev/, "https://pedro.dev", /\.pedroferrari.com/, "https://pedroferrari.com"],
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}
