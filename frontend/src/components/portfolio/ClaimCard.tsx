"use client";

import { useEffect } from "react";
import { usePortfolioData } from "@/hooks";
import { useClaimCoupon } from "@/hooks/useBondSeries";
import toast from "react-hot-toast";

export default function ClaimCard() {
  const { claimableAmount, isConnected } = usePortfolioData();
  const { claimCoupon, isPending, isSuccess, hash } = useClaimCoupon();

  // Show success toast
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(
        <div className="flex flex-col gap-1">
          <div>✅ Claimed {claimableAmount} USDC successfully!</div>
          <a 
            href={`https://testnet.arcscan.app/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-center text-base font-medium text-blue-600 hover:underline"
          >
            View on Explorer!
          </a>
        </div>
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, hash]);

  const handleClaim = () => {
    toast.loading("Claiming coupon...");
    claimCoupon();
  };

  const canClaim = isConnected && parseFloat(claimableAmount) > 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Claim Coupon</h3>
        <div className="text-sm text-gray-600">
          ℹ️ Coupons are paid daily at 1% per day
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 border border-custom rounded-lg p-4 text-center">
          <div className="text-base text-gray-900">
            Claimable Amount: <span className="font-bold">{claimableAmount} USDC</span>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={!canClaim || isPending}
          className="w-full btn-primary font-medium py-2 px-4 disabled:opacity-50"
        >
          {!isConnected 
            ? "Connect wallet to claim"
            : isPending 
              ? "Claiming..." 
              : "Claim Coupon"}
        </button>
      </div>
    </div>
  );
}

