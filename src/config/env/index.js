import path from "path";
import development from "./development";
import production from "./production";

const environment = process.env.NODE_ENV || "development";

const defaults = {
  root: path.join(__dirname, "/../.."),
};

const env = environment === "development" ? development : production;

export default {
  ...defaults,
  ...env,
};
