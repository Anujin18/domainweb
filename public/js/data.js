var XMLHttpRequest = require('xhr2');
let req = new XMLHttpRequest();

req.onreadystatechange = () => {
  if (req.readyState == XMLHttpRequest.DONE) {
    console.log(req.responseText);
  }
};

req.open("GET", "https://api.jsonbin.io/v3/b/679fbb65e41b4d34e482e39e?meta=false", true);
req.setRequestHeader("X-Master-Key", "$2a$10$gykCRmKE7En1QFoVep4yv.d4XCnaCZBEfIU4WnwP0rH53AOwumK5u");
req.send();

// export default class Data {
//     constructor(dataUrl) {
//         this.url 
//     }
// }