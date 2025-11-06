"use client";

import { useEffect } from "react";
import { usePortfolioData } from "@/hooks";
import { useDashboardData } from "@/hooks";
import { useRedeem } from "@/hooks/useBondSeries";
import toast from "react-hot-toast";

export default function RedeemCard() {
  const { abondBalance, abondBalanceRaw, redeemableAmount, isConnected } = usePortfolioData();
  const { hasMatured, timeToMaturity } = useDashboardData();
  const { redeem, isPending, isSuccess, hash } = useRedeem();

  // Show success toast
  useEffect(() => {
    if (isSuccess && hash) {
      toast.success(
        <div className="flex flex-col gap-1">
          <div>✅ Redeemed {redeemableAmount} USDC successfully!</div>
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

  const handleRedeem = () => {
    if (!abondBalanceRaw) return;
    toast.loading("Redeeming principal...");
    redeem(abondBalance); // Pass formatted amount, hook will parse it
  };

  const canRedeem = isConnected && hasMatured && parseFloat(abondBalance) > 0;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Redeem Principal</h3>
        {!hasMatured && (
          <div className="text-sm text-gray-600">
            ⏰ Matures in: {timeToMaturity}
          </div>
        )}
        {hasMatured && (
          <div className="text-sm text-green-600">
            ✅ Matured
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-50 border border-custom rounded-lg p-4 text-center">
          <div className="text-base text-gray-900">
            Your arcUSDC Balance: <span className="font-bold">{abondBalance} arcUSDC</span>
          </div>
        </div>

        <button
          onClick={handleRedeem}
          disabled={!canRedeem || isPending}
          className="w-full btn-primary font-medium py-2 px-4 disabled:opacity-50"
        >
          {!isConnected 
            ? "Connect wallet to redeem"
            : isPending 
              ? "Redeeming..." 
              : "Redeem All"}
        </button>
      </div>
    </div>
  );
}

