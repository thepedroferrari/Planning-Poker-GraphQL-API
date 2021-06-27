import { SessionOptions } from "express-session"
import { COOKIE_SECRET } from "../env"

export const cookieSettings: SessionOptions = {
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
  },
}
