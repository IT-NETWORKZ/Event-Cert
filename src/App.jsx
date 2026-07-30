import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import ChatBot from "./components/common/ChatBot/ChatBot";

function App() {
  return (
    <>
      <AppRoutes />
      
   
      <ChatBot />
    </>
  );
}

export default App;


// import { useEffect } from "react";
// import AppRoutes from "./routes/AppRoutes";


// function App() {
  
//   return <AppRoutes />;
// }

// export default App;