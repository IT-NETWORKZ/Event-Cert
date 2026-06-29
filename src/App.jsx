// import AppRoutes from "./routes/AppRoutes";


// function App() {

// return <AppRoutes/>

// }

// export default App

import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

import AOS from "aos";
import "aos/dist/aos.css";

function App() {

  useEffect(() => {
    AOS.init({
      duration: 900,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return <AppRoutes />;
}

export default App;