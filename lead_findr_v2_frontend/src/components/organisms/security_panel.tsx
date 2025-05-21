"use client";

import React from "react";
import ResetPasswordForm from "@/components/molecules/reset_password_form";
import DeleteAccountModal from "@/components/molecules/user_delete_account";
import "../../app/(protected)/settings/settings.css";

export default function SecurityPanel() {
    return (
        <section className="security-panel">
            <div className="security-section">
                <h2 className="security-heading">🔐 Password & Access</h2>
                <p className="security-subtext">
                    Change your login credentials to keep your account secure.
                </p>
                <ResetPasswordForm />
            </div>

            <div className="security-section">
                <h2 className="security-heading">⚠️ Account Termination</h2>
                <p className="security-subtext">
                    You can permanently delete your account. This action cannot be undone.
                </p>
                <DeleteAccountModal />
            </div>

            {/* Future 2FA Slot */}
            {/* 
            <div className="security-section">
                <h2 className="security-heading">2FA (Coming Soon)</h2>
                <p className="security-subtext">Two-Factor Authentication support is coming soon.</p>
            </div> 
            */}
        </section>
    );
}
