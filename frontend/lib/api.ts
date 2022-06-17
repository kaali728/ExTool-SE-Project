import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { Asset } from "../types/global";
import { firestore } from "./firebase";

export async function createNewAsset(asset: any){
    const docRef = await addDoc(collection(firestore, "assets"), {
        name: asset.name,
        sn: asset.sn,
        imageUrl: asset.imageUrl,
        time: "",
        status: "",
      });
      console.log("Document written with ID: ", docRef.id);
      toast.success("Asset created successfully");
}