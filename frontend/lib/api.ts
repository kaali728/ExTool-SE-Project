import axios from "axios";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { AssetTableObject } from "types/global";
import { firestore } from "./firebase";
import { ENGINE } from "./models/assetEnum";

export async function createNewAsset(asset: any) {
  const docRef = await addDoc(collection(firestore, "assets"), {
    name: asset.name,
    serialNumber: asset.serialNumber,
    imageUrl: asset.imageUrl,
    time: asset.time,
    status: asset.status,
    table: asset.table,
    engine: asset.engine,
    location: asset.location,
    machineHours: asset.machineHours,
  });
  console.log("Document written with ID: ", docRef.id);
  toast.success("Asset created successfully");
  return asset;
}

export async function updateTable(id: any, table: AssetTableObject[]) {
  const assetDoc = doc(firestore, "assets", id);

  await updateDoc(assetDoc, {
    table: table,
  });

  toast.success("Table saved");
}

export async function getAssetStatusAirFleet(id: number){
  const auth = {
    username: "Parshome@yahoo.com",
    password: "12345678Aa1"
  }
  let idTest = "185516";
  const url = `https://api.airiqfleet.com/v2/assets/${idTest}/status`
  let basicAuth = 'Basic ' + btoa(auth.username + ':' + auth.password);
  let headers = {
    'Content-Type': 'text/json',
    'Access-Control-Allow-Origin': "*",
    "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
    'Authorization': basicAuth
  };
  try {
    const res = await axios.get(url, { headers, withCredentials: false});
    const data = JSON.stringify(res.data);
    console.log("getAssetStatusAirFleet", data);
    return data;
  } catch (error) {
    console.log("Error on Airefleet get status", error);
  }
}
