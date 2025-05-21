"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { LoaderCircle, CheckCircle2 } from "lucide-react";
import { getScanProgress, ProgressLog } from "@/lib/session/progress_log";
import { motion } from "framer-motion";

interface ScanProgressModalProps {
    scanId: string;
    open: boolean;
    onClose: () => void;
    initialStep?: number;
}

const STEP_LABELS: Record<number, string> = {
    1: "🚀 Starting scan process...",
    2: "🧭 Validating location...",
    3: "📍 Verifying location and downloading GeoJSON...",
    4: "📦 Fetching businesses from Google Places...",
    5: "🧠 Running DPI scoring on businesses...",
    6: "💾 Saving results and finalizing scan.",
};

export default function ScanProgressModal({
    scanId,
    open,
    onClose,
    initialStep = 1,
}: ScanProgressModalProps) {
    const router = useRouter();
    const [step, setStep] = useState<number>(initialStep);
    const [message, setMessage] = useState<string>(STEP_LABELS[initialStep]);
    const [progress, setProgress] = useState<number>(initialStep * 20);
    const [completed, setCompleted] = useState<boolean>(false);

    useEffect(() => {
        if (!open || !scanId) return;

        setStep(initialStep);
        setMessage(STEP_LABELS[initialStep]);
        setProgress(initialStep * 20);
        setCompleted(false);

        const interval = setInterval(async () => {
            try {
                const { step: latestStep, status: newMessage }: ProgressLog =
                    await getScanProgress(scanId);

                setStep(latestStep);
                setMessage(newMessage || STEP_LABELS[latestStep]);
                setProgress(Math.min(latestStep * 20, 100));

                if (latestStep >= 6) {
                    clearInterval(interval);
                    setCompleted(true);

                    // after a brief pause, navigate away
                    setTimeout(() => {
                        onClose();            // close the modal
                        router.push("/businesses");
                    }, 1500);
                }
            } catch (err) {
                console.error("❌ Error fetching scan progress", err);
            }
        }, 2000);

        return () => clearInterval(interval);
    }, [scanId, open, onClose, initialStep, router]);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="p-6 w-[90vw] max-w-md bg-white rounded-xl shadow-xl"
            >
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    {completed ? (
                        <CheckCircle2 className="text-green-600 w-5 h-5" />
                    ) : (
                        <LoaderCircle className="animate-spin w-5 h-5 text-blue-600" />
                    )}
                    {completed ? "Scan Complete" : "Scan in Progress"}
                </h2>
                <p className="mt-2 text-sm text-gray-600">{message}</p>

                <div className="mt-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "easeInOut", duration: 0.8 }}
                    >
                        <Progress value={progress} />
                    </motion.div>
                    <p className="mt-2 text-xs text-gray-400">Step {step}/6</p>
                </div>
            </motion.div>
        </Dialog>
    );
}
