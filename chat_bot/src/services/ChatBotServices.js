import request from "request";

require("dotenv").config();

const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;

const IMAGE_GET_STARTED =
  "https://dienmaythienhoa.vn/static/images/Hinh-cam-nang/co-nen-mua-tai-khoan-netflix.jpg";

const ACCOUNT_IMAGE =
  "https://cdn.tgdd.vn/Files/2021/06/28/1363968/netflix-ra-mat-mobile-plan_1280x1382-800-resize.jpg";

const MOVIES_IMAGE =
  "https://www.whats-on-netflix.com/wp-content/uploads/2021/11/whats-coming-to-netflix-in-december-2021.jpg";

const RATING_IMAGE =
  "https://static1.colliderimages.com/wordpress/wp-content/uploads/2021/03/best-new-movies-netflix-march-2021-v2.png?q=50&fit=contain&w=943&h=472&dpr=1.5";

const ACTION_IMAGE =
  "https://img.phimchill.tv/images/film/cuoc-chien-chong-xam-lang-mien-nhiet-doi.jpg";

const HORROR_IMAGE =
  "https://img.phimchill.tv/images/film/thay-cung-ba-dong.jpg";

const FICTION_IMAGE =
  "https://img.phimchill.tv/images/film/quy-do-2-binh-doan-dia-nguc.jpg";

const WAR_IMAGE =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/cliff-walkers.jpg";
const PSYCHO_IMAGE =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/jirisan.jpg";
const LOVE_IMAGE =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/once-we-get-married.jpg";

const BACK_IMAGE =
  "https://reelsrated.com/wp-content/uploads/2021/07/Trending-Movies-On-Netflix-Right-Now.jpg";

const VIEW_ACTION_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/chimera.png";
const VIEW_ACTION_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/dangerous.jpg";
const VIEW_ACTION_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/no-time-to-die-2021.jpg";

const VIEW_HORROR_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/last-night-in-soho.jpg";
const VIEW_HORROR_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/the-cursed-deads-mans-prey.jpg";
const VIEW_HORROR_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/the-night-house.jpg";

const VIEW_FICTION_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/venom-let-there-be-carnage.jpg";
const VIEW_FICTION_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/spider-man-no-way-home.jpg";
const VIEW_FICTION_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/finch.jpg";

const VIEW_WAR_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/shershaah.jpg";
const VIEW_WAR_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/game-of-thrones-2.jpg";
const VIEW_WAR_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/alita-battle-angel.jpg";

const VIEW_PSYCHO_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/high-class.jpg";
const VIEW_PSYCHO_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/operation-hyacinth.jpg";
const VIEW_PSYCHO_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/control-z.jpg";

const VIEW_LOVE_IMAGE_1 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/yumis-cells.jpg";
const VIEW_LOVE_IMAGE_2 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/rebirth-for-you.jpg";
const VIEW_LOVE_IMAGE_3 =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/the-map-of-tiny-perfect-things.jpg";

const IMAGE_RATING_MOVIES =
  "https://img1.kakaocdn.net/thumb/R1280x0/?fname=https://img.phimchill.tv/images/info/squid-game-2021.jpg";

const MOVIE_GIF_WELCOME =
  "https://media0.giphy.com/media/3o7rc0qU6m5hneMsuc/giphy.gif?cid=ecf05e47hk9iee6897or2m99o4kgpelg2yd10r8v5nqxpqwr&rid=giphy.gif&ct=g";

let callSendAPI = async (sender_psid, response) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct the message body
      let request_body = {
        recipient: {
          id: sender_psid,
        },
        message: response,
      };

      // trước khi gửi lại tin cho người dùng phải đọc
      await sendMarkSeen(sender_psid);

      // sau đó typing (dấu 3 chấm) rồi mới gửi
      await sendTypingOn(sender_psid);

      // khúc này là gửi nè
      // Send the HTTP request to the Messenger Platform
      request(
        {
          uri: "https://graph.facebook.com/v12.0/me/messages",
          qs: { access_token: PAGE_ACCESS_TOKEN },
          method: "POST",
          json: request_body,
        },
        (err, res, body) => {
          if (!err) {
            resolve("message sent!");
          } else {
            console.error("Unable to send message:" + err);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

// lấy tên người dùng để hiển thị câu chào
let getUserName = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
        method: "GET",
      },
      (err, res, body) => {
        console.log(body);
        if (!err) {
          body = JSON.parse(body);
          let username = `${body.first_name} ${body.last_name}`;
          resolve(username);
        } else {
          console.error("Unable to send message:" + err);
          reject(error);
        }
      }
    );
  });
};

// xử lí khi người dùng nhấn nút Bắt Đầu
let handleGetStarted = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      let username = await getUserName(sender_psid);

      let response1 = {
        text: `Xin chào! Chào mừng ${username} đến với Netflix Clone`,
      };

      //cái carousel template sau câu chào mừng
      // let response2 = sendGetStartedTemplate();

      //send an image
      let response2 = getImageGetStartedTemplate();

      // quick repli template
      let response3 = sendGetStartedQuickReplyTemplate();

      // gửi câu chào mừng
      await callSendAPI(sender_psid, response1);

      //gửi image chào mừng
      await callSendAPI(sender_psid, response2);

      //quick reply
      await callSendAPI(sender_psid, response3);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

//cái carousel template sau câu chào mừng
let sendGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title:
              "Hãy tận hưởng phút giây thư giãn với bộ phim yêu thích của bạn!",
            subtitle: "Dưới đây là các hạng mục phim nổi bật",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "DANH MỤC PHIM",
                payload: "MAIN_MENU",
              },
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ACCOUNT}`,
                title: "TẠO TÀI KHOẢN",
                webview_height_ratio: "tall",
                messenger_extensions: true, //false: open the webview in new tab

                // type: "postback",
                // title: "TẠO TÀI KHOẢN",
                // payload: "RESERVE_ACCOUNT",
              },
              {
                type: "postback",
                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                payload: "GUIDE_TO_USE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

// image chào mừng
let getImageGetStartedTemplate = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: MOVIE_GIF_WELCOME,
        is_reusable: true,
      },
    },
  };
  return response;
};

// template mới của get started
let sendGetStartedQuickReplyTemplate = () => {
  let response = {
    text: "Hãy tận hưởng phút giây thư giãn với bộ phim yêu thích của bạn!",
    quick_replies: [
      {
        content_type: "text",
        title: "DANH MỤC PHIM",
        payload: "MAIN_MENU",
        // cái này là cái ảnh hiện bên cạnh chữ trong quick reply (sau này muốn dùng thì dùng)
        // image_url:"http://example.com/img/red.png"
      },
      {
        content_type: "text",
        title: "HD SỬ DỤNG BOT",
        payload: "GUIDE_TO_USE",
      },
    ],
  };
  return response;
};

// xử lí khi nhấn vào nút danh mục phim
let handleSendMainMenu = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendMainMenuTemplate(sender_psid);

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

//template cho xử lí sau khi nhấn danh mục phim
let sendMainMenuTemplate = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Phim của chúng tôi",
            subtitle:
              "Chúng tôi hân hạnh mang đến cho bạn những trải nghiệm thú vị nhất",
            image_url: MOVIES_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "PHIM MỚI NHẤT",
                payload: "NEW_MOVIES",
              },
              {
                type: "postback",
                title: "PHIM YÊU THÍCH",
                payload: "FAVORITE_MOVIES",
              },
            ],
          },
          {
            title: "Trở thành thành viên",
            subtitle:
              "Đăng kí để nhận ngay những ưu đãi lên đến 10% chỉ dành riêng cho bạn.",
            image_url: ACCOUNT_IMAGE,
            buttons: [
              {
                type: "web_url",
                url: `${process.env.URL_WEB_VIEW_ACCOUNT}/${senderID}`,
                title: "TẠO TÀI KHOẢN",
                webview_height_ratio: "tall",
                messenger_extensions: true, //false: open the webview in new tab

                // type: "postback",
                // title: "TẠO TÀI KHOẢN",
                // payload: "RESERVE_ACCOUNT",
              },
            ],
          },
          {
            title: "Phim đề cử",
            subtitle: "Website cập nhật liên tục các phim mới nhất mỗi ngày",
            image_url: RATING_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "CHI TIẾT",
                payload: "RATING_MOVIES",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

//xử lí khi nhấn vào nút phim mới nhất
let handleSendNewMovies = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendNewMoviesTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendNewMoviesTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Hành động",
            subtitle:
              "Những bộ phim bom tấn đến từ các quốc gia châu Mỹ sẽ làm bạn bất ngờ",
            image_url: ACTION_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_ACTION",
              },
            ],
          },
          {
            title: "Kinh dị",
            subtitle:
              "Những khoảnh khắc gay cấn, bất ngờ với các tựa phim kinh dị nổi tiếng",
            image_url: HORROR_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_HORROR",
              },
            ],
          },
          {
            title: "Viễn tưởng",
            subtitle:
              "Choáng ngợp với những thước phim tiết lộ cho chúng ta về viễn cảnh tương lai.",
            image_url: FICTION_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_FICTION",
              },
            ],
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleSendFavoriteMovies = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendFavoriteMoviesTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendFavoriteMoviesTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Chiến tranh",
            subtitle: "Cuốn hút người xem không rời mắt khỏi màn hình",
            image_url: WAR_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_WAR",
              },
            ],
          },
          {
            title: "Tâm lí",
            subtitle: "Người xem sẽ trải qua vô vàn khuôn bậc cảm xúc",
            image_url: PSYCHO_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_PSYCHO",
              },
            ],
          },
          {
            title: "Tình cảm",
            subtitle:
              "Những bộ phim về tình yêu đôi lứa sẽ chinh phục trái tim bạn",
            image_url: LOVE_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "XEM CHI TIẾT",
                payload: "VIEW_LOVE",
              },
            ],
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

//xử lí nhấn nút quay trở lại
let handleBackToMainMenu = async (sender_psid) => {
  await handleSendMainMenu(sender_psid);
};

let handleDetailViewAction = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewActionTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewActionTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Quái vật Chimera",
            subtitle:
              "Là bộ phim truyền hình đang phát sóng của Hàn Quốc do Kim Do-hoon đạo diễn và Lee Jin-mae viết kịch bản.",
            image_url: VIEW_ACTION_IMAGE_1,
          },
          {
            title: "Hiểm nguy",
            subtitle:
              "Là câu chuyện hành trình điều tra về cái chết của anh trai của một người đàn ông ở một hòn đảo xa xôi.",
            image_url: VIEW_ACTION_IMAGE_2,
          },
          {
            title: "Không phải lúc chết",
            subtitle:
              "Bond sẽ thực hiện nhiệm vụ giải cứu nhà khoa học bị bắt cóc, và từ đó dẫn anh đến với tên ác nhân sở hữu một loại công nghệ nguy hiểm.",
            image_url: VIEW_ACTION_IMAGE_3,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleDetailViewHorror = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewHorrorTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewHorrorTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Đêm trước ở Soho",
            subtitle:
              "Bộ phim tâm lý kinh dị năm 2021 của Anh. Quá trình quay phim bắt đầu vào ngày 23 tháng 5 năm 2019 và hoàn thành vào ngày 30 tháng 8 năm 2019.",
            image_url: VIEW_HORROR_IMAGE_1,
          },
          {
            title: "Những kẻ bị nguyền rủa",
            subtitle:
              "Một vụ án giết người hàng loạt bí ẩn xảy ra bởi jaechaui (xác chết sống lại từ cõi chết và có thể nói chuyện). Những cơ thể này được thao túng bởi một ai đó.",
            image_url: VIEW_HORROR_IMAGE_2,
          },
          {
            title: "Ngôi nhà về đêm",
            subtitle:
              "Beth bắt đầu phải chịu đựng những sự kiện siêu nhiên kỳ lạ vào ban đêm và tìm thấy một sơ đồ tầng đảo ngược kỳ lạ cho ngôi nhà của họ.",
            image_url: VIEW_HORROR_IMAGE_3,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleDetailViewFiction = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewFictionTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewFictionTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Venom: Đối mặt tử thủ",
            subtitle:
              "Nhà báo điều tra Eddie Brock phải đấu tranh để thích nghi với cuộc sống như các máy chủ của người ngoài hành tinh symbiote Venom ",
            image_url: VIEW_FICTION_IMAGE_1,
          },
          {
            title: "Lão già Finch",
            subtitle:
              "Một nhà phát minh ốm yếu, người đàn ông cuối cùng trên Trái đất, đã chế tạo một android robot để nhiệm vụ bảo vệ ông và chú chó của ông , tiếp tục hành trình khắp đất nước.",
            image_url: VIEW_FICTION_IMAGE_3,
          },
          {
            title: "Người nhện: Không còn nhà",
            subtitle:
              "Những kẻ thù nguy hiểm từ các thế giới khác bắt đầu xuất hiện, buộc Peter phải khám phá ra ý nghĩa thực sự của việc trở thành Người Nhện.",
            image_url: VIEW_FICTION_IMAGE_2,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleDetailViewWar = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewWarTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewWarTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Cuộc chiến Kargil",
            subtitle:
              "Bộ phim bắt đầu với Vishal Batra ( Sidharth Malhotra ) nói chuyện trong một khán phòng về người anh em song sinh tử vì đạo của mình, Đại úy Vikram Batra.",
            image_url: VIEW_WAR_IMAGE_1,
          },
          {
            title: "Trò chơi vương quyền",
            subtitle:
              " Sau cuộc tấn công của White Walkers, những Người canh gác của Đêm còn sống sót, bao gồm Samwell Tarly và Jeor Mormont , cam kết trở lại Bức tường và cảnh báo Bảy Vương quốc.",
            image_url: VIEW_WAR_IMAGE_2,
          },
          {
            title: "Alita: Chiến binh thiên thần",
            subtitle:
              "Alita được ví như một thần chết đến từ địa ngục vì những khả năng vượt qua mọi giới hạn mà cô sở hữu.",
            image_url: VIEW_WAR_IMAGE_3,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleDetailViewPsycho = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewPsychoTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewPsychoTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Đẳng cấp thượng lưu",
            subtitle:
              "Phim kể về những thói trăng hoa và đạo đức giả ẩn sau cuộc sống hoàn hảo của những người phụ nữ sống trong nhóm 0,1% hàng đầu của xã hội.",
            image_url: VIEW_PSYCHO_IMAGE_1,
          },
          {
            title: "Chiến dịch Hyacinth",
            subtitle:
              "Lấy bối cảnh từ năm 1985 đến năm 1987, khi hành động của cảnh sát mật nổi tiếng được thực thi.",
            image_url: VIEW_PSYCHO_IMAGE_2,
          },
          {
            title: "Bí mật giấu kín",
            subtitle:
              "Trong một buổi họp tại trường Colegio Nacional (Trường Quốc gia), một hacker đã tiết lộ một bí mật lớn của một trong những học sinh.",
            image_url: VIEW_PSYCHO_IMAGE_3,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

let handleDetailViewLove = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //cái template khi nhấn vào nút danh mục phim
      let response1 = sendDetailViewLoveTemplate();

      await callSendAPI(sender_psid, response1);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendDetailViewLoveTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Tế bào của Yumi",
            subtitle:
              "Yu-Mi ( Kim Go-Eun ) là một phụ nữ làm việc độc thân bình thường. Cô ấy không giỏi thể hiện cảm xúc của mình.",
            image_url: VIEW_LOVE_IMAGE_1,
          },
          {
            title: "Gia Nam Truyện",
            subtitle:
              "Công chúa của Gia Nam Jiang Bao Ning cân bằng từng bước lực lượng với trí tuệ và sự thông minh của mình, trong thời gian đó cô quen và yêu một cận vệ hoàng gia Li Qian.",
            image_url: VIEW_LOVE_IMAGE_2,
          },
          {
            title: "Bản đồ tình yêu",
            subtitle:
              "Mark, một cậu bé tuổi teen, đã bị mắc kẹt trong một vòng lặp thời gian, lặp đi lặp lại cùng một ngày.",
            image_url: VIEW_LOVE_IMAGE_3,
          },
          {
            title: "Quay trở lại",
            subtitle: "Quay trở lại Danh mục phim",
            image_url: BACK_IMAGE,
            buttons: [
              {
                type: "postback",
                title: "TRỞ LẠI",
                payload: "BACK_TO_MAIN_MENU",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

//xử lí dấu ba chấm cho biết bot đang phản hồi người dùng
let sendTypingOn = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "typing_on",
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v12.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("send typing on sent!");
      } else {
        console.error("Unable to send typing on:" + err);
      }
    }
  );
};

//xử lí bot đã đọc tin nhắn (seen)
let sendMarkSeen = (sender_psid) => {
  // Construct the message body
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    sender_action: "mark_seen",
  };

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: "https://graph.facebook.com/v12.0/me/messages",
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "POST",
      json: request_body,
    },
    (err, res, body) => {
      if (!err) {
        console.log("send typing on sent!");
      } else {
        console.error("Unable to send typing on:" + err);
      }
    }
  );
};

// gửi ảnh chi tiết cho phim đề cử
let sendImageDetailRatingMovies = () => {
  let response = {
    attachment: {
      type: "image",
      payload: {
        url: IMAGE_RATING_MOVIES,
        is_reusable: true,
      },
    },
  };
  return response;
};

// template nút bên dưới ảnh phim đề cử
let sendTemplateDetailRatingMovies = (senderID) => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "button",
        text: "Những bộ phim gây sốt toàn cầu luôn có sẵn trong tủ phim của bạn.",
        buttons: [
          {
            type: "web_url",
            url: `${process.env.URL_WEB_VIEW_ACCOUNT}/${senderID}`,
            title: "TẠO TÀI KHOẢN",
            webview_height_ratio: "tall",
            messenger_extensions: true, //false: open the webview in new tab

            // type: "postback",
            // title: "TẠO TÀI KHOẢN",
            // payload: "RESERVE_ACCOUNT",
          },
          {
            type: "postback",
            title: "TRỞ LẠI",
            payload: "BACK_TO_MAIN_MENU",
          },
        ],
      },
    },
  };

  return response;
};

// xử lí nút phim đề cử
let handleDetailRatingMovies = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //send an image
      let response1 = sendImageDetailRatingMovies();

      //send a button template : text, buttons
      let response2 = sendTemplateDetailRatingMovies(sender_psid);

      await callSendAPI(sender_psid, response1);

      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

// let handleReserveAccount = (sender_psid) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       let username = await getUserName(sender_psid);
//       let response = {
//         text: `Hi ${username}, What username do want you to use for this account?`,
//       };
//       await callSendAPI(sender_psid, response);

//       resolve("done");
//     } catch (error) {
//       reject(error);
//     }
//   });
// };

let handleSendBotGuide = (sender_psid) => {
  return new Promise(async (resolve, reject) => {
    try {
      //send text message
      let username = await getUserName(sender_psid);

      let response1 = {
        text: `Xin chào ${username}, mình là chatbot của website xem phim.
        \n Để biết thêm thông tin, bạn vui lòng tham khảo video bên dưới 😍`,
      };

      //send a media template : video, buttons
      let response2 = sendVideoMediaTemplate();

      await callSendAPI(sender_psid, response1);

      await callSendAPI(sender_psid, response2);

      resolve("done");
    } catch (error) {
      reject(error);
    }
  });
};

let sendVideoMediaTemplate = () => {
  let response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "media",
        elements: [
          {
            media_type: "video",
            url: "https://business.facebook.com/102898768901702/videos/322976289342857/",
            buttons: [
              {
                type: "postback",
                title: "DANH MỤC PHIM",
                payload: "MAIN_MENU",
              },
              {
                type: "web_url",
                title: "THÊM THÔNG TIN",
                url: "https://www.facebook.com/profile.php?id=100009899738623",
                webview_height_ratio: "full",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
};

module.exports = {
  handleGetStarted: handleGetStarted,
  handleSendMainMenu: handleSendMainMenu,
  handleSendNewMovies: handleSendNewMovies,
  handleSendFavoriteMovies: handleSendFavoriteMovies,
  handleBackToMainMenu: handleBackToMainMenu,
  handleDetailViewAction: handleDetailViewAction,
  handleDetailViewHorror: handleDetailViewHorror,
  handleDetailViewFiction: handleDetailViewFiction,
  handleDetailViewWar: handleDetailViewWar,
  handleDetailViewPsycho: handleDetailViewPsycho,
  handleDetailViewLove: handleDetailViewLove,
  handleDetailRatingMovies: handleDetailRatingMovies,
  // handleReserveAccount: handleReserveAccount,
  handleSendBotGuide: handleSendBotGuide,
  callSendAPI: callSendAPI,
  getUserName: getUserName,
};
