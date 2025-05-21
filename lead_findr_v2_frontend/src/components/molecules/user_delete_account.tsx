"use client";

import { useState, useEffect, useRef } from "react";
import { deleteUserAccount } from "@/lib/api/user_client";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function DeleteAccountModal() {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [confirmationText, setConfirmationText] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const isValid = confirmationText === "delete";

    useEffect(() => {
        if (showConfirm && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showConfirm]);

    const handleDelete = async () => {
        if (!isValid) {
            toast.error("You must type 'delete' to confirm.");
            return;
        }

        try {
            setLoading(true);
            await deleteUserAccount();
            toast.success("Account deleted. Goodbye.");
            localStorage.clear();

            // Slight delay before redirect
            setTimeout(() => {
                window.location.href = "/";
            }, 500);
        } catch (err: unknown) {
            let message = "Failed to delete account.";

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    message = "Session expired. Please log in again.";
                } else if (err.response?.data?.detail) {
                    message = err.response.data.detail;
                }
            }

            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        toast("Please type 'delete' manually — no copy/paste allowed.", {
            icon: "🛑",
        });
    };

    return (
        <div className="executive-delete">
            {!showConfirm ? (
                <button
                    className="executive-delete-btn"
                    onClick={() => setShowConfirm(true)}
                >
                    <Trash2 size={18} /> Delete My Account
                </button>
            ) : (
                <ConfirmationCard
                    inputRef={inputRef}
                    confirmationText={confirmationText}
                    setConfirmationText={(val) => setConfirmationText(val.toLowerCase().trim())}
                    loading={loading}
                    isValid={isValid}
                    onCancel={() => setShowConfirm(false)}
                    onDelete={handleDelete}
                    onPaste={handlePaste}
                />
            )}
        </div>
    );
}

interface ConfirmationCardProps {
    inputRef: React.RefObject<HTMLInputElement | null>;
    confirmationText: string;
    setConfirmationText: (val: string) => void;
    loading: boolean;
    isValid: boolean;
    onCancel: () => void;
    onDelete: () => void;
    onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
}

function ConfirmationCard({
    inputRef,
    confirmationText,
    setConfirmationText,
    loading,
    isValid,
    onCancel,
    onDelete,
    onPaste,
}: ConfirmationCardProps) {
    return (
        <div className="executive-delete-card animate-fade-slide-in">
            <h3 className="exec-title">Confirm Account Deletion</h3>
            <p className="exec-desc">
                Deleting your account is an irreversible action. You will permanently lose access to all your data, including any business information that has not been exported.
            </p>

            <label className="exec-confirm-label">
                Type <span className="delete-keyword">delete</span> to confirm:
            </label>
            <input
                ref={inputRef}
                type="text"
                className="exec-confirm-input"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value.toLowerCase().trim())}
                onPaste={onPaste}
                placeholder="Type 'delete' here"
            />

            <div className="exec-actions">
                <button className="exec-cancel" onClick={onCancel} disabled={loading}>
                    Cancel
                </button>
                <div title={!isValid ? "Type 'delete' to enable this action" : ""}>
                    <button
                        className="exec-confirm"
                        onClick={onDelete}
                        disabled={loading || !isValid}
                    >
                        {loading ? (
                            <Loader2 className="spin" size={16} />
                        ) : (
                            "Confirm Deletion"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
