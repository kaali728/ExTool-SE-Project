import { addDoc, collection } from "firebase/firestore";
import toast from "react-hot-toast";
import { Asset } from "../types/global";
import { firestore } from "./firebase";

export async function createNewAsset(asset: any){
    const docRef = await addDoc(collection(firestore, "assets"), {
        name: asset.name,
        serialNumber: asset.serialNumber,
        imageUrl: asset.imageUrl,
        time: asset.time,
        status: asset.status,
        table: [],
        engine: "",
        location: { long: 0, lat: 0 },
        machineHours: 0,
      });
      console.log("Document written with ID: ", docRef.id);
      toast.success("Asset created successfully");
      return asset;
}