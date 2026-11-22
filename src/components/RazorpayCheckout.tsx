'use client';

import React, { useState } from 'react';
import { PlanId } from '@/types/billing';

interface RazorpayCheckoutProps {
  planId: PlanId;
  planName: string;
  priceInr: number;
  onSuccess?: () => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const RazorpayCheckout: React.FC<RazorpayCheckoutProps> = ({
  planId,
  planName,
  priceInr,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Failed to load payment gateway. Please check your internet connection.');
        setIsLoading(false);
        return;
      }

      // Create server-side order
      const res = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Could not initiate checkout.');
      }

      const orderData = json.data;

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'JobSync India',
        description: `Upgrade to ${planName}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          alert(`Payment Successful! Payment ID: ${response.razorpay_payment_id}. Your account runs have been credited.`);
          if (onSuccess) onSuccess();
          window.location.href = '/workspace';
        },
        prefill: {
          name: 'Candidate',
          email: 'candidate@jobsync.in',
          contact: '9876543210',
        },
        theme: {
          color: '#1c1917', // Stone-900
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      const error = err as Error;
      alert(error.message || 'Payment initiation failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      disabled={isLoading}
      onClick={handleCheckout}
      className="w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold uppercase tracking-wider rounded font-mono transition shadow-sm"
    >
      {isLoading ? 'Preparing Order...' : `Pay ₹${priceInr} via UPI / Cards →`}
    </button>
  );
};
