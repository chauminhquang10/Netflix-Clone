require("dotenv").config();
import request from "request";
import ChatBotServices from "../services/ChatBotServices";
import moment from "moment";

const { GoogleSpreadsheet } = require("google-spreadsheet");

// const PRIVATE_KEY =
//   "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDTZ4zoQ7zleQJ3\n+TIdfARK10wgrrVQ/8P/KB/p8YYdDA7gdXMAb+BM+GK7tkja+o6uoPoASGmZtWer\nxJKWXc3Fe4E9O0Mukj5aNohhxhDMCc6m7chTDa4+m9kaR9eFNc/y8GxviyNjXy4F\ne9yY3zbyD5QrP2C5zocvLNYVGAb0n/VQTbRbFkn+ACXoISCzGDFiBYJq6PppjtAC\nZmYC5pI/rCF/HBIv/fbFo9iG3WX4gLcYu817QOai378zySfkuSQbtakRgJ0p1cPC\nD2xtxaFSo21BaS/oMgXdWhANDyuD3q8nQS6UrjwjQT5BNH4RedVKn1aOI+t1CJoI\nmCATsEVJAgMBAAECggEAAKLb2nnx1zoSvwuUHOmRYJsDBXw5Gyi14IfwoU/6Xmxg\nBBXvdhN1cbiEw2jyInr2LUHrhZvLxsGWWBhdhfZZVdsmkph7aKgeX2qPByPlD8/b\nrTmwMLh1d/3uK4EGrLj/WY1BTGoqW4v6wsp/PvZ03Q4/gzbwD217KQdMj/VjTSul\nhT3swpnploJZ2doCZ1wpuGIV/UiIfq9nrZwF9x95x9yhNUtnrnfMUyPuUKFJv1MO\n339BXr+Jly6Zu6hr0aCrbD7jn2G+PkqflHdVK5rvIoZiGZdUJwqWTFr3K21iQrnS\nHP6Nf1VH+sMm9yxJtA15OWE1QNHIVSHkv3Tiak3DoQKBgQD6dZwNc498ECPRIAgE\nypytJfTpUPfO1GVJFycTOze9BBNweusB7pyWDDLIpGoDYq/39eh8oishKpk2U9W7\nurN+3qQWTIoPxWboFcuaEVd1tR6FCg8yXiGSGwmOU3Nmrso5dIBz0IC9X/HI+oWs\nYIxhEYEZPR/v641s9ZkBWoXSUQKBgQDYFMRMVJ8HBBJs9y7Hne4jwAxksxASI24n\n3DWkaVjPTKyRs5YbCvP13YU9dD23w+lIh4pBdhkH+Gf2P1ppLiA7y1Ir73nXL4Pm\n9UPAs5FnccA9VnI6rHn6CDKIRJrlxNtLS/2C5yqwGQyzkna67CCxW5VQ3CSw8Z3y\nUKJjYnXNeQKBgQCjz6hxY9PE4QmMDdcwyxQOa3Tz5PEvZduZInt8KI8cIT5Vow9y\nBA6GVRQiBucPr8xH8Z5NZgOvfZ0X210/m60qnZPUwdrK1eGoihjQe+coJX4ApcOq\nvcZXOTfWzt37mvbI/VnGZejN86LAQJqNU9h85GX7i+8HjJjDWx7ns70zAQKBgEQK\nvgl/OBiAesDfUVbAb4XIat6m2C+uAnkAyc988N9OOKUk1OatG0dXuyYv3WNpiKMz\nMyEL7DPrT+ll57VpNfM+QiDdpxNQvgtTPkOHCAl3814dQ5kgSMSoIilw2QnzZE6g\nnjLDUljjenFtdH/F7UGMIke1GsSxQNhV9dyv24KZAoGBAJlwLi1fKuNe8I/jQgMs\nEKKsRRc2PmAROKhhE+bnDG9poh/KRFVoMdTW94v7cK122zB3yEXEePvUBjSVTRYS\n6dRBl9yzzbULOTcLcAla0CxK2UVXrkVGmZpdZ1nR6UoRAFDm7bDmGS7Dw73vrmE9\nzFcs+V+sMgg/N2yqO+aviYNA\n-----END PRIVATE KEY-----\n";
// const CLIENT_EMAIL =
//   "movie-google-sheet@movieproject-328107.iam.gserviceaccount.com";
// const SHEET_ID = "1EDGDhiZGPjG_Gy8Sm_7sUXulo0HVuMxmEXLdpik0Fzg";

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const CLIENT_EMAIL = process.env.CLIENT_EMAIL;

const SHEET_ID = process.env.SHEET_ID;

let getHomePage = (req, res) => {
  return res.render("HomePage.ejs");
};

// ghi dữ liệu khách hàng vào google sheet
let writeDataToGoogleSheet = async (data) => {
  let formatedDate = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
  });

  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(SHEET_ID);

  // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    client_email: JSON.parse(`"${CLIENT_EMAIL}"`),
    private_key: JSON.parse(`"${PRIVATE_KEY}"`),
  });

  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

  // append rows
  await sheet.addRow({
    "Tên Facebook": data.username,
    Email: data.email,
    "Số điện thoại": `'` + data.phoneNumber,
    "Thời gian": formatedDate,
    "Tên khách hàng": data.customerName,
  });
};

let setupProfile = async (req, res) => {
  //gọi profile facebook api

  // Construct the message body
  let request_body = {
    get_started: { payload: "GET_STARTED" },
    whitelisted_domains: ["https://netflix-chat-bot.herokuapp.com/"],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Set up user profile succeeds!");
      } else {
        console.error("Unable to set up user profile:" + err);
      }
    }
  );

  return res.send("Set up user profile succeeds!");
};

let setupPersistentMenu = async (req, res) => {
  // Construct the message body
  let request_body = {
    persistent_menu: [
      {
        locale: "default",
        composer_input_disabled: false,
        call_to_actions: [
          {
            type: "web_url",
            title: "Liên hệ Admin",
            url: "https://www.facebook.com/profile.php?id=100009899738623",
            webview_height_ratio: "full",
          },
          {
            type: "web_url",
            title: "Facebook fanpage",
            url: "https://www.facebook.com/Netflix-Chat-Bot-104643132046138",
            webview_height_ratio: "full",
          },
          {
            type: "postback",
            title: "Khởi động lại chat",
            payload: "RESTART_BOT",
          },
        ],
      },
    ],
  };

  // Send the HTTP request to the Messenger Platform
  await request(
    {
      uri: `https://graph.facebook.com/v12.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      console.log(body);
      if (!err) {
        console.log("Set up persistent menu succeeds!");
      } else {
        console.error("Unable to set up persistent menu:" + err);
      }
    }
  );

  return res.send("Set up persistent menu succeeds!");
};

let handleReserveAccount = (req, res) => {
  let senderId = req.params.senderId;
  return res.render("ReserveAccount.ejs", {
    senderId: senderId,
  });
};

let postWebHook = (req, res) => {
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === "page") {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("Sender PSID: " + sender_psid);

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
};

let getWebHook = (req, res) => {
  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
    // Checks the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Responds with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
};

// Handles messages events
async function handleMessage(sender_psid, received_message) {
  let response;

  //check messages for quick replies
  if (received_message.quick_reply && received_message.quick_reply.payload) {
    if (received_message.quick_reply.payload === "MAIN_MENU") {
      await ChatBotServices.handleSendMainMenu(sender_psid);
    }
    if (received_message.quick_reply.payload === "GUIDE_TO_USE") {
      await ChatBotServices.handleSendBotGuide(sender_psid);
    }
    return;
  }

  // Checks if the message contains text
  if (received_message.text) {
    // Create the payload for a basic text message, which
    // will be added to the body of our request to the Send API
    response = {
      text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
    };
  } else if (received_message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = received_message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }
  // Send the response message
  callSendAPI(sender_psid, response);
}

// //  HÀM XỬ LÍ TRẢ LỜI TIN NHẮN ĐẶT BÀN
// let handleMessageWithEntities = (received_message) => {
//   let entitiesArr = ["wit$datetime:datetime", "wit$phone_number:phone_number"];
//   let entityChosen = "";
//   let data = {}; // data is an object saving value and name of the entity.

//   entitiesArr.forEach((name) => {
//     let entity = firstTrait(message.nlp, name.trim());
//     if (entity && entity.confidence > 0.8) {
//       entityChosen = name;
//       data.value = entity.value;
//     }
//   });

//   data.name = entityChosen;

//   console.log("-------------");
//   console.log("giá trị:", entitiesArr);
//   console.log("-------------");

//   return data;
// };

// function firstTrait(nlp, name) {
//   return nlp && nlp.entities && nlp.traits[name] && nlp.traits[name][0];
// }

// Handles messaging_postbacks events
async function handlePostback(sender_psid, received_postback) {
  let response;

  // Get the payload for the postback
  let payload = received_postback.payload;

  // Set the response based on the postback payload

  switch (payload) {
    case "yes":
      response = { text: "Thanks!" };
      break;
    case "no":
      response = { text: "Oops, try sending another image." };
      break;

    // khởi động lại vs get started y chang nhau
    case "RESTART_BOT":
    case "GET_STARTED":
      await ChatBotServices.handleGetStarted(sender_psid);
      break;

    //xử lí khi nhấn vào nút danh mục phim
    case "MAIN_MENU":
      await ChatBotServices.handleSendMainMenu(sender_psid);
      break;

    case "NEW_MOVIES":
      await ChatBotServices.handleSendNewMovies(sender_psid);
      break;

    case "FAVORITE_MOVIES":
      await ChatBotServices.handleSendFavoriteMovies(sender_psid);
      break;

    case "VIEW_ACTION":
      await ChatBotServices.handleDetailViewAction(sender_psid);
      break;
    case "VIEW_HORROR":
      await ChatBotServices.handleDetailViewHorror(sender_psid);
      break;
    case "VIEW_FICTION":
      await ChatBotServices.handleDetailViewFiction(sender_psid);
      break;

    case "VIEW_WAR":
      await ChatBotServices.handleDetailViewWar(sender_psid);
      break;
    case "VIEW_PSYCHO":
      await ChatBotServices.handleDetailViewPsycho(sender_psid);
      break;
    case "VIEW_LOVE":
      await ChatBotServices.handleDetailViewLove(sender_psid);
      break;

    case "BACK_TO_MAIN_MENU":
      await ChatBotServices.handleBackToMainMenu(sender_psid);
      break;

    case "RATING_MOVIES":
      await ChatBotServices.handleDetailRatingMovies(sender_psid);
      break;

    // case "RESERVE_ACCOUNT":
    //   await ChatBotServices.handleReserveAccount(sender_psid);
    //   break;

    case "GUIDE_TO_USE":
      await ChatBotServices.handleSendBotGuide(sender_psid);
      break;

    default:
      response = {
        text: `Oops, I don't know response with postback ${payload}`,
      };
  }

  // Send the message to acknowledge the postback
  // callSendAPI(sender_psid, response);
}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v2.6/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("message sent!");
      } else {
        console.error("Unable to send message:" + err);
      }
    }
  );
}

//xử lí cho việc nhấn nút tạo tài khoản trong form
let handlePostReserveAccount = async (req, res) => {
  try {
    let username = await ChatBotServices.getUserName(req.body.psid);

    // data sẽ ghi vào google sheet
    let data = {
      username: username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      customerName: req.body.customerName,
    };

    await writeDataToGoogleSheet(data);

    let customerName = "";
    if (req.body.customerName === "") {
      customerName = username;
    } else customerName = req.body.customerName;

    // I demo response with sample text
    // you can check database for customer order's status

    let response1 = {
      text: `---Thông tin tài khoản người dùng---
           \nHọ và tên: ${customerName}
           \nĐịa chỉ email: ${req.body.email}
           \nSố điện thoại: ${req.body.phoneNumber}
             `,
    };

    await ChatBotServices.callSendAPI(req.body.psid, response1);

    return res.status(200).json({
      message: "ok",
    });
  } catch (e) {
    console.log("Lỗi post reserve account: ", e);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = {
  getHomePage: getHomePage,
  postWebHook: postWebHook,
  getWebHook: getWebHook,
  setupProfile: setupProfile,
  setupPersistentMenu: setupPersistentMenu,
  handleReserveAccount: handleReserveAccount,
  handlePostReserveAccount: handlePostReserveAccount,
};
