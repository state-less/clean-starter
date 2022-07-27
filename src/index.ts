import { render } from "react-server";
import router from "./server";

(async () => {
  /** Render the server */
  await render(router);
})();
