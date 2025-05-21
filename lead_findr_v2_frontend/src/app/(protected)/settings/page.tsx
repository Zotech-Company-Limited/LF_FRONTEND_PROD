"use client";

import React from "react";
import { updateUserAccount } from "@/lib/api/user_client";
import { useUser } from "@/lib/api/swr";
import ProfileDropdown from "@/components/organisms/user_profile_dropdown";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SecurityPanel from "@/components/organisms/security_panel";
import SubscriptionSection from "@/components/organisms/subscription_section";
import UserApiKeyModule from "@/components/organisms/user_apikey_module";
import "./settings.css";

const SettingsPage: React.FC = () => {
    const { user, isLoading, refreshUser } = useUser();

    const updateUserProfile = async ({
        fullName,
        phone,
        username,
    }: {
        fullName: string;
        phone: string;
        username: string;
    }) => {
        try {
            await updateUserAccount({
                full_name: fullName,
                phone,
                username,
            });
            await refreshUser();
        } catch (err) {
            console.error("❌ Failed to update profile", err);
        }
    };

    if (isLoading) return <p className="settings-loading">Loading settings…</p>;
    if (!user) return <p className="settings-error">Failed to load user.</p>;

    return (
        <div className="flex h-screen overflow-auto bg-gray-50 mt-5">
            <div className="flex-1 flex flex-col">
                <main className="settings-container">
                    <header className="settings-header">
                        <h1 className="settings-title">⚙️ Settings</h1>
                        <p className="settings-subtitle">
                            Manage your personal profile, API credentials, and subscription plan.
                        </p>
                    </header>

                    <Tabs defaultValue="profile" className="settings-tabs">
                        <TabsList className="settings-tablist">
                            <TabsTrigger value="profile" className="unstyled-tab">Profile</TabsTrigger>
                            <TabsTrigger value="api" className="unstyled-tab">API Keys</TabsTrigger>
                            <TabsTrigger value="subscription" className="unstyled-tab">Subscription</TabsTrigger>
                            <TabsTrigger value="security" className="unstyled-tab">Security</TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <div className="settings-card">
                                <h2 className="settings-section-title">👤 Your Profile</h2>
                                <ProfileDropdown
                                    fullName={user.full_name ?? ""}
                                    email={user.email}
                                    phone={user.phone ?? ""}
                                    username={user.username ?? ""}
                                    updateUserProfile={updateUserProfile}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="api">
                            <div className="settings-card">
                                <UserApiKeyModule />
                            </div>
                        </TabsContent>

                        <TabsContent value="subscription">
                            <SubscriptionSection />
                        </TabsContent>

                        <TabsContent value="security">
                            <SecurityPanel />
                        </TabsContent>
                    </Tabs>
                </main>
            </div>
        </div>
    );
};

export default SettingsPage;