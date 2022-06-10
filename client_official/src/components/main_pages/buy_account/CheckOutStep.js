import React, { useState, useContext, useEffect } from "react";

import { GlobalState } from "../../../GlobalState";

import { Link, useHistory } from "react-router-dom";

import axios from "axios";

import "./CheckOutStep.css";

import PayPalCheckOut from "./PayPalCheckOut";

import StripeCheckout from "react-stripe-checkout";

import moment from "moment";

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

const CheckOutStep = () => {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [userPackage, setUserPackage] = state.usersAPI.userPackage;
  const [packages] = state.packagesAPI.packages;
  const [isValidAccount, setIsValidAccount] = state.usersAPI.isValidAccount;
  const [isNotExpireAccount, setIsNotExpireAccount] =
    state.usersAPI.isNotExpireAccount;

  const [historyCallback, setHistoryCallback] = state.usersAPI.historyCallback;

  const [checkOutPackage, setCheckOutPackage] = useState({});

  // stripe payment
  const [stripeToken, setStripeToken] = useState(null);

  const history = useHistory();

  // phần khuyến mãi
  // danh sách mã user đã dùng (lấy từ db)
  const [userDiscounts, setUserDiscounts] = state.usersAPI.userDiscounts;
  //callback cập nhật lại danh sách mã
  const [discountCallback, setDiscountCallback] =
    state.usersAPI.discountCallback;
  //  thành tiền
  const [total, setTotal] = useState(0);
  // tiền giảm giá
  const [reducePrice, setReducePrice] = useState(0);

  // biến lưu tổng phần trăm giảm giá để check vượt quá 100% không ?
  const [checkTotalPercents, setCheckTotalPercents] = useState(0);

  // biến lưu mã giảm giá trong thẻ input
  const [discountInput, setDiscountInput] = useState("");

  //biến hiển thị trạng thái của mã giảm giá
  const [discountError, setDiscountError] = useState(false);
  const [discountErrorText, setDiscountErrorText] = useState("");

  //biến loading nút
  const [loading, setLoading] = useState(false);

  // get stripe token
  const onToken = (token) => {
    setStripeToken(token);
  };

  useEffect(() => {
    if (packages.length !== 0) {
      // ktra gói khách hàng chọn có bị admin xóa k ?
      if (Object.keys(userPackage).length !== 0) {
        if (packages.some((pack) => pack._id === userPackage.packId._id)) {
          setCheckOutPackage(userPackage);
        }
      } else {
        let currentDate = moment().format("YYYY-MM-DD");
        let expireDate = moment().add(30, "days").format("YYYY-MM-DD");

        //lấy gói đầu tiên
        setCheckOutPackage({
          packId: { ...packages[0] },
          startedTime: currentDate,
          expireTime: expireDate,
        });
      }
    }
  }, [userPackage, packages]);

  // xử lí phần khuyến mãi
  useEffect(() => {
    const checkTotal = (packagePrice) => {
      if (userDiscounts.length !== 0) {
        const totalDiscountPercents = userDiscounts.reduce((prev, item) => {
          return prev + item.discountValue;
        }, 0);
        const discountPrice = (
          (packagePrice * totalDiscountPercents) /
          100
        ).toFixed(0);
        const finalPrice = packagePrice - discountPrice;

        setCheckTotalPercents(totalDiscountPercents);
        setReducePrice(discountPrice);
        setTotal(finalPrice);
      } else {
        setCheckTotalPercents(0);
        setReducePrice(0);
        setTotal(packagePrice);
      }
    };

    if (packages.length !== 0) {
      // ktra gói khách hàng chọn có bị admin xóa k ?
      if (Object.keys(userPackage).length !== 0) {
        if (packages.some((pack) => pack._id === userPackage.packId._id)) {
          checkTotal(userPackage.packId.price);
        } else {
          checkTotal(packages[0].price);
        }
      }
    }
  }, [userDiscounts, packages, userPackage]);

  useEffect(() => {
    const callStripeAPI = async () => {
      try {
        const res = await axios.post("/api/stripe_payment", {
          tokenId: stripeToken.id,
          amount: total * 100,
        });

        stripeTranSucess(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    stripeToken && callStripeAPI();
  }, [stripeToken, history]);

  // xử lí nhập mã
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(
        "/api/verifyDiscount",
        { name: discountInput, checkTotalPercents },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLoading(false);
      if (res.data.msg === "success") {
        setDiscountCallback(!discountCallback);
        setDiscountError(false);
        setDiscountErrorText("");
      }
    } catch (error) {
      setDiscountError(true);
      setLoading(false);
      setDiscountErrorText(error.response.data.msg);
    }
  };

  // xử lí hủy mã
  const handleCancelCode = async (id) => {
    try {
      await axios.patch(
        "/user/cancelCode",
        { codeID: id },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setDiscountCallback(!discountCallback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const updateUserPackage = async (userPackage) => {
    await axios.patch(
      "/user/addpackage",
      {
        service_pack: userPackage,
      },
      {
        headers: { Authorization: token },
      }
    );
  };

  const updateBuyPackage = async (userBuyPackage) => {
    await axios.patch(
      "/user/buypackage",
      {
        buy_package: {
          packId: userBuyPackage.packId._id,
          startedTime: userBuyPackage.startedTime,
          expireTime: userBuyPackage.expireTime,
        },
      },
      {
        headers: { Authorization: token },
      }
    );
  };

  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;

    await axios.post(
      "/api/payment",
      {
        service_pack: checkOutPackage,
        paymentID,
        address,
        paymentMethod: "paypal",
        discountPrice: reducePrice,
        discounts: userDiscounts,
      },
      {
        headers: { Authorization: token },
      }
    );

    // gửi mail confirm đơn hàng
    const { country_code } = address;

    await axios.post(
      "/user/confirmMail",
      {
        country_code,
        paymentID,
        service_pack: checkOutPackage,
        beforeDiscount: checkOutPackage.packId.price,
        afterDiscount: total,
      },
      {
        headers: { Authorization: token },
      }
    );

    setUserPackage({});
    updateUserPackage({});
    updateBuyPackage(checkOutPackage);

    alert("You have check out successfully");
    setHistoryCallback(!historyCallback);

    setIsValidAccount(true);
    setIsNotExpireAccount(true);

    // chuyển trang
    history.push("/browse");
  };

  const stripeTranSucess = async (payment) => {
    if (payment.status === "succeeded") {
      const { name, address } = payment.billing_details;
      const newAddress = {
        recipient_name: name,
        line1: address.line1,
        city: address.city,
        state: address.state,
        postal_code: address.postal_code,
        country_code: address.country,
      };

      await axios.post(
        "/api/payment",
        {
          service_pack: checkOutPackage,
          paymentID: payment.id,
          address: newAddress,
          paymentMethod: "stripe",
          discountPrice: reducePrice,
          discounts: userDiscounts,
        },
        {
          headers: { Authorization: token },
        }
      );

      // gửi mail confirm đơn hàng
      await axios.post(
        "/user/confirmMail",
        {
          country_code: address.country,
          paymentID: payment.id,
          service_pack: checkOutPackage,
          beforeDiscount: checkOutPackage.packId.price,
          afterDiscount: total,
        },
        {
          headers: { Authorization: token },
        }
      );

      setUserPackage({});
      updateUserPackage({});
      updateBuyPackage(checkOutPackage);

      alert("You have check out successfully");
      setHistoryCallback(!historyCallback);

      setIsValidAccount(true);
      setIsNotExpireAccount(true);

      // chuyển trang
      history.push("/browse");
    }
  };

  return (
    <div className="checkout_step_container">
      <div className="checkout_step_wrapper">
        <div className="checkout_step_number">
          Step <span className="checkout_step_bold_number">3</span> of
          <span className="checkout_step_bold_number"> 3</span>
        </div>
        <h2 className="choice_text_checkout_step">
          Set up your credit or debit card
        </h2>
        <div className="checkout_step_logos">
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/visa-v3.svg"
          ></img>
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/mastercard-v2.svg"
          ></img>
          <img
            alt=""
            src="https://assets.nflxext.com/ffe/siteui/acquisition/payment/svg/amex-v2.svg"
          ></img>
        </div>
        {checkOutPackage?.packId ? (
          <Link to="/step_2">
            <button type="button" className="checkout_step_btn">
              <div className="checkout_step_btn_left_content">
                <span className="checkout_step_btn_left_content_title">
                  {checkOutPackage.packId.price}
                  &nbsp;₫/month
                </span>
                <span className="checkout_step_btn_left_content_description">
                  {checkOutPackage.packId.title}
                </span>
              </div>
              <button type="button" className="checkout_step_btn_right_content">
                Change
              </button>
            </button>
          </Link>
        ) : (
          <div>
            <Link to="/step_2">
              <button type="button" className="checkout_step_btn_no_plan">
                Choose Plan
              </button>
            </Link>
          </div>
        )}

        <span className="checkout_step_subtext checkout_step_first_subtext">
          Your payments will be processed internationally. Additional bank fees
          may apply.
        </span>

        <span className="checkout_step_subtext checkout_step_second_subtext">
          By checking the checkbox below, you agree to our{" "}
          <a
            target="_blank"
            href="https://help.netflix.com/legal/termsofuse"
            className="policy_term_text"
          >
            Terms of Use
          </a>
          ,{" "}
          <a
            target="_blank"
            href="https://help.netflix.com/legal/privacy"
            className="policy_term_text"
          >
            Privacy Statement
          </a>
          , and that you are over 18. Netflix will automatically continue your
          membership and charge the membership fee (currently
          260,000&nbsp;₫/month) to your payment method until you cancel. You may
          cancel at any time to avoid future charges.
        </span>

        {/* Coupon Code */}
        <div style={{ margin: "40px 0px" }}>
          <TextField
            label="Coupon Code"
            id="outlined-size-normal"
            value={discountInput}
            onChange={(e) => setDiscountInput(e.target.value)}
            error={discountError}
            helperText={discountErrorText}
          />
          <LoadingButton
            loadingIndicator="Loading..."
            variant="outlined"
            onClick={handleVerifyCode}
            loading={loading}
          >
            Verify
          </LoadingButton>
          {`Giảm giá is : ${reducePrice}`}
          {`Total is : ${total}`}
          {userDiscounts.map((item) => (
            <div>
              <h1>{item.name}</h1>
              <h4>{`${item.discountValue}%`}</h4>
              <Button
                variant="outlined"
                onClick={() => handleCancelCode(item._id)}
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>

        {checkOutPackage?.packId && (
          <>
            <PayPalCheckOut
              total={total}
              tranSuccess={tranSuccess}
            ></PayPalCheckOut>
            <StripeCheckout
              name="Rex Movie"
              image="https://t3.ftcdn.net/jpg/02/80/09/58/360_F_280095865_QBy7eRsxjFhiB4dhFnuUq0Uz0HC5An7Q.jpg"
              billingAddress
              shippingAddress
              description={`Your total is $${total}`}
              amount={total * 100}
              token={onToken}
              stripeKey="pk_test_51KaF2rLjv0wfcc1sJyQlomCRXjfcJoD9vZ8U1BInVIwR7hGiP9kQF3KXOqiSyMiq3x4CZApKHjOwdgDFoTrtu8GS00Q4LpDso9"
            >
              <button
                style={{
                  border: "none",
                  width: 120,
                  borderRadius: 5,
                  padding: "20px",
                  backgroundColor: "black",
                  color: "white",
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                Pay Now
              </button>
            </StripeCheckout>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckOutStep;
