// // create varaiable to hold the db connection
// let db;

// //  establish a connection to IndexDB database called 'budget'; and set it to verison 1 
// const request = indexedDB.open('budget',1);


// // this event wil; emit if the database verison chagnes (nonexistant to verison1, v1, to v2 etx..)
// request.onupgradeneeded  = function (event){
//     //  save a reference to the databse;
//     let db = event.target.result;
//     // create  an object store(table) called `new_trans` set it to have an auto incrememting primary key
//     db.createObjectStore('new-trans', { autoIncrement: true });
// }


// // upon a sucessful
// request.onsuccess = function(event){
//     // when db is sucessfully created with its object  store(from onupgradeneeded event above) or  simply established a connection, save reference to db in global variable
//     db = event.target.result;

//     // check if app is onlone, if yes run uploadtransaction() function to send all local db data to api
//     if(navigator.onLine){
//         uploadtransactions;
//     }
// }

// request.onerror = function(event){
//     //  log error here
//     console.log(event.target.errorCode)
// }


// // this function will be excuted if we attempt to submit a new trans and there's not internet connection
// function saveRecord(record){
//     // open a new trans with the database with read and wrtie premissions
//     const transaction = db.transaction(['new-trans'], 'readwrite');
//     // access the object store for `new-trans`
//     const store = transaction.objectStore('new-trans')
//     //  add record to your store with add method
//     store.add(record)
// }



// function uploadtransactions() {
//     // open a transaction on your db
//     const transaction = db.transaction(['new-trans'], 'readwrite');

//     //access your object store
//     const transactionObjectStore = transaction.objectStore('new-trans');

//     // get all records from store and set to a variable
    
//     const getAll = transactionObjectStore.getAll()


//     // upon a sucessful .getAll() execution, run this function
//     getAll.onsucess = function() {

//     //  if there was data in indexDB's store, let's send it to the api server
//     if(getAll.result.length > 0){
//         fetch('api/transaction/bulk', {
//             method: 'POST',
//             body: JSON.stringify(getAll.result),
//             headers: {
//                 Accpet:' application/json, test/plain, */*',
//                 'Content-Type': 'application/json'
//             }
//         })
//         .then(response => response.json())
//         .then(serverResponse =>{
//             if(serverResponse.message){
//                 throw new Error(serverResponse);
//             }
//             //open one more transaction
//             const transaction = db.transaction(['new-trans'], 'readwrite');

//             //access your object store
//             const transactionObjectStore = transaction.objectStore('new-trans');

//             // clear allitems in yur store
//             transactionObjectStore.clear()

//             alert('All saved transaction has been submitted!');
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }
//     };
// }

// //  listen for app coming back online

// window.addEventListener('online', uploadtransactions
// )



// let db;
// const request = indexedDB.open("budget", 1);

// request.onupgradeneeded = ({ target }) => {
//   let db = target.result;
//   db.createObjectStore("pending", { autoIncrement: true });
// };

// request.onsuccess = ({ target }) => {
//   db = target.result;

//   // check if app is online before reading from db
//   if (navigator.onLine) {
//     checkDatabase;
//   }
// };

// request.onerror = function(event) {
//   console.log("Woops! " + event.target.errorCode);
// };

// function saveRecord(record) {
//   const transaction = db.transaction(["pending"], "readwrite");
//   const store = transaction.objectStore("pending");

//   store.add(record);
// }

// function checkDatabase() {
//   const transaction = db.transaction(["pending"], "readwrite");
//   const store = transaction.objectStore("pending");
//   const getAll = store.getAll();

//   getAll.onsuccess = function() {
//     if (getAll.result.length > 0) {
//       fetch("/api/transaction/bulk", {
//         method: "POST",
//         body: JSON.stringify(getAll.result),
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json"
//         }
//       })
//       .then(response => {        
//         return response.json();
//       })
//       .then(() => {
//         // delete records if successful
//         const transaction = db.transaction(["pending"], "readwrite");
//         const store = transaction.objectStore("pending");
//         store.clear();
//       });
//     }
//   };
// }

// // listen for app coming back online
// window.addEventListener("online", checkDatabase);



let db
const request = indexedDB.open('budget', 1)

//in the event of database version changes
request.onupgradeneeded = (e) => {
  const db = e.target.result
  db.createObjectStore('pending', { autoIncrement: true })
}

//upon a successful creation
request.onsuccess = (e) => {
  db = e.target.result
  //   check if online, and if true, update database
  if (navigator.onLine) {
    offlineData()
  }
}

// error handling
request.onerror = (e) => console.log(e.target.errorCode)

// function to store data when offline
const saveRecord = (record) => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  store.add(record)
}

const offlineData = () => {
  const transaction = db.transaction(['pending'], 'readwrite')
  const store = transaction.objectStore('pending')
  const allRecords = store.getAll()

  allRecords.onsuccess = () => {
    // if any data stored in indexDB, update database
    if (allRecords.result.length > 0) {
      fetch('/api/transaction/bulk', {
        method: 'POST',
        body: JSON.stringify(allRecords.result),
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
      })
        .then((response) => response.json())
        .then((serverResponse) => {
          if (serverResponse.message) {
            throw new Error(serverResponse)
          }
          //open one more transaction
          const transaction = db.transaction(['pending'], 'readwrite')

          //access the pending object store
          const store = transaction.objectStore('pending')

          //clear all items in store
          store.clear()

          alert('All pending transactions have been submitted!')
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}

window.addEventListener('online', offlineData)