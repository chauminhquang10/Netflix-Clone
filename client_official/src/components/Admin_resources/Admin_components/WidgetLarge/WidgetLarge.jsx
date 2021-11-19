import React from "react";
import "./WidgetLarge.css";

const WidgetLarge = () => {
  const Button = ({ type }) => {
    return <button className={"widgetLargeButton " + type}>{type}</button>;
  };

  return (
    <div className="widgetLarge">
      <h3 className="widgetLargeTitle">Latest transactions</h3>
      <table className="widgetLargeTable">
        <tbody>
          <tr className="widgetLargeTr">
            <th className="widgetLargeTh">Customer</th>
            <th className="widgetLargeTh">Date</th>
            <th className="widgetLargeTh">Amount</th>
            <th className="widgetLargeTh">Status</th>
          </tr>
          <tr className="widgetLargeTr">
            <td className="widgetLargeUser">
              <img
                className="widgetLargeImg"
                src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              ></img>
              <span className="widgetLargeName">Susan Jane</span>
            </td>
            <td className="widgetLargeDate">10 June 2021</td>
            <td className="widgetLargeAmount">$1001.00</td>
            <td className="widgetLargeStatus">
              <Button type="Approved"></Button>
            </td>
          </tr>
          <tr className="widgetLargeTr">
            <td className="widgetLargeUser">
              <img
                className="widgetLargeImg"
                src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              ></img>
              <span className="widgetLargeName">Susan Jane</span>
            </td>
            <td className="widgetLargeDate">10 June 2021</td>
            <td className="widgetLargeAmount">$1001.00</td>
            <td className="widgetLargeStatus">
              <Button type="Declined"></Button>
            </td>
          </tr>
          <tr className="widgetLargeTr">
            <td className="widgetLargeUser">
              <img
                className="widgetLargeImg"
                src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              ></img>
              <span className="widgetLargeName">Susan Jane</span>
            </td>
            <td className="widgetLargeDate">10 June 2021</td>
            <td className="widgetLargeAmount">$1001.00</td>
            <td className="widgetLargeStatus">
              <Button type="Pending"></Button>
            </td>
          </tr>
          <tr className="widgetLargeTr">
            <td className="widgetLargeUser">
              <img
                className="widgetLargeImg"
                src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
              ></img>
              <span className="widgetLargeName">Susan Jane</span>
            </td>
            <td className="widgetLargeDate">10 June 2021</td>
            <td className="widgetLargeAmount">$1001.00</td>
            <td className="widgetLargeStatus">
              <Button type="Approved"></Button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WidgetLarge;
