import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { STATE_CHANGED, storage } from "lib/firebase";
import toast from "react-hot-toast";
import { AssetPictureDownloadUrl, AssetPictures } from "types/global";
import { v4 } from "uuid";

function uploadImagesFiles(files: AssetPictures, path: string): AssetPictureDownloadUrl | undefined {
    if (!files) return;
   
    const fileMap = new Map(Object.entries(files));

    let _downloadUrls: AssetPictureDownloadUrl = {
        front: "",
        rightSide: "",
        leftSide: "",
        back: "",
        fuelGuage: "",
        hoursReading: "",
    };

    fileMap.forEach(async (value, key) => {
        const storageRef = ref(
            storage,
            path.concat(`${key}-${v4()}`)
          );

        _downloadUrls[key as keyof AssetPictureDownloadUrl] = await uploadFile(storageRef, value);
        console.log(`${key} image is uploaded`);
    })
  
    return _downloadUrls;
  }



function uploadAdditionalFiles(files: File[], path: string): Promise<string[]> | undefined {
    if (!files) return;
    let urls: string[] = []; 
    
    files.map(async (image: any, index: number) => {
      const storageRef = ref(
        storage,
        path.concat("-"+`${index}`)
      );
      
      urls.push(await uploadFile(storageRef, image));
    });

    let _downloadUrls = Promise.all(urls).then(function (results) {
      return results;
    });    

    console.log(_downloadUrls);
    

    return _downloadUrls;
  }


  async function uploadFile(storageRef: any, image: any){
    const metadata = {
        contentType: "image/jpeg",
      };

    const uploadTask = uploadBytesResumable(storageRef, image, metadata);

      uploadTask.on(
        STATE_CHANGED,
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              toast.error("User doesn't have permission to access the object");
              break;
            case "storage/canceled":
              // User canceled the upload
              toast.error("User canceled the upload");
              break;
          }
        }
      );
      await uploadTask;
      const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
      return downloadUrl;
  }

export {uploadAdditionalFiles, uploadImagesFiles};