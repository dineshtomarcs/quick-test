import PaymentModal from "./components/PaymentModal";

const Cancel = () => {
  return (
    <div>
      <PaymentModal
        dataAttr="payment-cancel-popup"
        status="Cancelled"
        message="Payment cancelled, please try again"
      />
    </div>
  );
};

export default Cancel;
