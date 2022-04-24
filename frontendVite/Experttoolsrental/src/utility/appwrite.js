import { Appwrite } from 'appwrite'
const appwrite = new Appwrite() // The reason we use window.Appwrite() is for compatability with <script> imported appwrite.
appwrite
    .setEndpoint('http://appwrite.alikarami.tech/v1') // We set the endpoint, change this if your using another endpoint URL.
    .setProject('624de3dc72f987b61f61') // Here replace 'ProjectID' with the project ID that you created in your appwrite installation.

export { appwrite } // Finally export the appwrite object to be used in projects.
