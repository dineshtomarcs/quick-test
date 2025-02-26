import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PaymentModal from "./components/PaymentModal";

const Success = () => {
  const [sessionId, setSessionId] = useState("");
  const location = useLocation();

  useEffect(() => {
    setSessionId(location.search.split("=")[1]);
  }, [location.search]);

  return (
    <div>
      <PaymentModal
        dataAttr="payment-success-popup"
        status="Successful"
        message="Congrats on purchasing the subscription"
      />
      <div className="hidden">{sessionId}</div>
    </div>
  );
};

export default Success;
