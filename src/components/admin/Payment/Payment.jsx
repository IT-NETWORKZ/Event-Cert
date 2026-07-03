import DataTable from "../../common/Table/DataTable";
import { paymentColumns } from "./paymentColumns";
import { paymentData } from "./paymentData";
import "./Payment.css";

function Payment() {
  return (
    <div className="payment-page">
      <div className="payment-header">
        <h2>Payment History</h2>
        <p>Manage all payment records.</p>
      </div>

      <DataTable
        columns={paymentColumns}
        data={paymentData}
      />
    </div>
  );
}

export default Payment;