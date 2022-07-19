const ConfirmMail = (
  email,
  name,
  country_code,
  paymentID,
  service_pack,
  currentDate,
  beforeDiscount,
  afterDiscount
) => {
  return `
        <!DOCTYPE html>
       <html >
       <head>
      
       </head>
       
      <body style=" font-family: 'Catamaran', sans-serif;
      background-color:#d8dbdb;
      font-size:18px;
      max-width:800px;
      margin:0 auto;
      padding: 2%;
      color:#565859;">
      
      <div id="wrapper" style=" background: #f6faff;">
      <header style="  width:98%;">
        <div id="logo" style="  max-width:220px;
        margin:2% 0 0 5%;">
          <img src="https://t3.ftcdn.net/jpg/02/80/09/58/360_F_280095865_QBy7eRsxjFhiB4dhFnuUq0Uz0HC5An7Q.jpg" style=" max-width:100%;"></img>
        </div>
      </header>
      <div class="one-col" style="padding: 2%;">
        <h1 style=" letter-spacing:1%;">Thank you for choosing us!</h1>
        <p style="text-align:justify;">Hello!</p>
        <p style="text-align:justify;">
          Your payment ${paymentID} has been placed successfully at ${currentDate}
          and we're processing it.
        </p>
        
  <h3>Payment Details</h3>
  <ul>
    <li>Name: ${name}</li>
    <li>Address: ${country_code}</li>
    <li>Email: ${email}</li>
    <li>Package: ${service_pack.packId.title}</li>
    <li>Amount:  ${beforeDiscount}$</li>
    <li>Official Amount: ${afterDiscount}$</li>
  </ul>
  <h3>Message</h3>
  <p style="text-align:justify;">Thank you for trusting us!</p>
        <p style="text-align:justify;">Best wishes for you</p>
        <div class="button-holder" style=" float:right;
        margin: 0 2% 4% 0;">
          <a class="btn" href="#" target="_blank" style=" float:right;
          background:#303840;
          color:#f6faff;
          text-decoration:none;
          font-weight:700;
          padding:8px 12px;
          border-radius:8px;
          letter-spacing:1px;">
            Learn More
          </a>
        </div>
      </div>
      <div class="line" style="  clear:both;
      height:2px;
      background-color:#e3e9e9;
      margin:4% auto;
      width:96%;"></div>
      <div class="two-col" style=" float:left;
      width:46%;
      padding:2%;">
        <h2>Latest Movies News</h2>
        <img src="https://primelightboxes.com/wp-content/uploads/2021/03/26.jpg" style=" max-width:100%;"></img>
        <p style="text-align:justify;">
          Explore about more fantastic movies with our variety of films, always bring
          the best to you with a reasonable price.
        </p>
      </div>
      <div class="two-col" style=" float:left;
      width:46%;
      padding:2%;">
        <h2>About Services</h2>
        <img src="https://www.washingtonpost.com/graphics/2019/entertainment/oscar-nominees-movie-poster-design/img/movieposters_promo.jpg" style=" max-width:100%;"></img>
        <p style="text-align:justify;">
          We're proud to be one of the most reliable customer services provider,
          our services is always available 24/7 and the online payment
          system will help you to get a faster and more convenient experiment.
        </p>
      </div>
      <div class="line" style="  clear:both;
      height:2px;
      background-color:#e3e9e9;
      margin:4% auto;
      width:96%;"></div>
      <p class="contact" style=" text-align:center;
      padding-bottom:3%;">
        Rex Movies <br></br>
        (555) 123-2131 <br></br>
        UIT - TP.HCM <br></br>
        RexMovies@onlineweb.com
      </p>
    </div>
      </body>
      </html>
        `;
};

module.exports = { ConfirmMail };
