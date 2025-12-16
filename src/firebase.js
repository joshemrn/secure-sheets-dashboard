import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChcZ4fufen7eqF1twTYS0ZaIRq923l90Q",
  authDomain: "sheets2-60985.firebaseapp.com",
  projectId: "sheets2-60985"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
