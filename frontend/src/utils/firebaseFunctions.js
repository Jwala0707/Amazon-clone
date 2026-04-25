import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

export const saveOrder = async (cart, total) => {
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first ❗");
    return;
  }

  await addDoc(collection(db, "orders"), {
    userId: user.uid,
    email: user.email,
    cart,
    total,
    created: new Date()
  });
};