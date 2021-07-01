import { SessionOptions } from "express-session"
import { COOKIE_SECRET } from "../env"

export const cookieSettings: SessionOptions = {
  secret: COOKIE_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    sameSite: "none",
    secure: true,
  },
}
