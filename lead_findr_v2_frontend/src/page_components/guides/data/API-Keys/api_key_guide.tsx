// data/steps/api_key_guide.tsx
import React from "react";

/* --------------------------------------------------------------------------
   Lead Findr 2.0 ▸ API-Key Setup Guide  -- 5 Easy Steps
   --------------------------------------------------------------------------
   • You need four values: google_api_key, google_search_api_key,
     google_search_cx, and gemini_api_key.
   • These JSX blocks feed the scroll-stepper on /setup/api-keys.
   • Use character entities (&apos;, &amp;, etc.) to keep eslint happy.
   -------------------------------------------------------------------------- */

export const API_KEY_SETUP_STEPS = [
    /* ───────────────────────────── 1 ───────────────────────────── */
    {
        id: "step-1",
        title: "Create a Google Cloud Project",
        content: (
            <>
                <p>
                    Go to&nbsp;
                    <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Google&nbsp;Cloud Console
                    </a>
                    , click the project drop-down, choose&nbsp;
                    <strong>New&nbsp;Project</strong>, give it a name you’ll remember
                    (for example <code className="mx-1">leadfindr-project</code>) and hit&nbsp;
                    <strong>Create</strong>. Make sure billing is enabled &ndash; Google will
                    prompt you if it isn’t.
                </p>
            </>
        ),
    },

    /* ───────────────────────────── 2 ───────────────────────────── */
    {
        id: "step-2",
        title: "Turn On the Required Google APIs",
        content: (
            <>
                <p>
                    In Cloud Console open&nbsp;
                    <strong>APIs&nbsp;&amp;&nbsp;Services ▸ Library</strong>.
                    Use the search bar and click <em>Enable</em> on each of these five:
                </p>
                <ul className="mt-2 list-disc list-inside">
                    <li>Places&nbsp;API</li>
                    <li>Places&nbsp;API&nbsp;(New)</li>
                    <li>Geocoding&nbsp;API</li>
                    <li>Custom&nbsp;Search&nbsp;API</li>
                    <li>Maps&nbsp;JavaScript&nbsp;API</li>
                    <li>Gemini&nbsp;API</li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">
                    That’s it for Cloud-side services. Gemini lives in AI Studio, so
                    you will switch apps for that key later.
                </p>
            </>
        ),
    },

    /* ───────────────────────────── 3 ───────────────────────────── */
    {
        id: "step-3",
        title: "Make Your Two Google API Keys",
        content: (
            <>
                <p>
                    In&nbsp;
                    <strong>APIs&nbsp;&amp;&nbsp;Services ▸ Credentials</strong> click&nbsp;
                    <em>Create Credentials ▸ API&nbsp;key</em>. Copy the value &ndash; that is your&nbsp;
                    <code>google_api_key</code> (used for Places&nbsp;+&nbsp;Geocoding).
                </p>
                <p className="mt-2">
                    Click <em>Create&nbsp;Credentials ▸ API&nbsp;key</em> again for a second key.
                    This one is only for Custom&nbsp;Search, so save it as&nbsp;
                    <code>google_search_api_key</code>.
                </p>
            </>
        ),
    },

    /* ───────────────────────────── 4 ───────────────────────────── */
    {
        id: "step-4",
        title: "Create a Programmable Search Engine",
        content: (
            <>
                <p>
                    Open&nbsp;
                    <a
                        href="https://programmablesearchengine.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Programmable Search Engine
                    </a>
                    , click&nbsp;<strong>Add</strong>, fill in a name, and choose
                    &ldquo;Search the entire web&rdquo;. (You can enable image search or Safe
                    Search if you like.)&nbsp;Click&nbsp;<strong>Create</strong>.
                </p>
                <p className="mt-2">
                    After it is created You&apos;ll see a short HTML snippet. Inside that
                    snippet look for&nbsp;<code>cx=&quot;YOUR_CX_CODE&quot;</code> – copy that value.
                </p>
                <p className="mt-2">
                    You can also find the same value any time in&nbsp;
                    <strong>Control&nbsp;Panel</strong>; it&apos;s listed as the
                    <em>Search&nbsp;Engine&nbsp;ID</em>. Paste it into Lead&nbsp;Findr as&nbsp;
                    <code>google_search_cx</code>.
                </p>
            </>
        ),
    },


    /* ───────────────────────────── 5 ───────────────────────────── */
    {
        id: "step-5",
        title: "Generate Your Gemini API Key",
        content: (
            <>
                <p>
                    Go to&nbsp;
                    <a
                        href="https://aistudio.google.com/app/apikey"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        Google&nbsp;AI&nbsp;Studio
                    </a>
                    . Make sure the project selector at the top matches the project you
                    created in Step&nbsp;1, then click&nbsp;<strong>Create&nbsp;API Key</strong>.
                </p>
                <p className="mt-2">
                    Copy the key &ndash; that’s your&nbsp;
                    <code>gemini_api_key</code> for AI-powered scoring.
                </p>
                <p className="mt-2">
                    Finally, log in to Lead&nbsp;Findr&nbsp;▸ <strong>Account Settings ▸ API Keys</strong>,
                    paste all four values, and hit&nbsp;<strong>Save</strong>. You’re ready to scan&nbsp;🚀
                </p>
            </>
        ),
    },
    /* ───────────────────────────── 6 ───────────────────────────── */
    {
        id: "step-6",
        title: "Add Keys inside Lead Findr",
        content: (
            <>
                <p>
                    Log in, open&nbsp;<strong>Account Settings ▸ API Keys</strong>
                    and paste the four values:
                </p>
                <ul className="list-disc list-inside mt-2">
                    <li><code>google_api_key</code></li>
                    <li><code>google_search_api_key</code></li>
                    <li><code>google_search_cx</code></li>
                    <li><code>gemini_api_key</code></li>
                </ul>
                <p className="mt-2">
                    Click&nbsp;<strong>Save</strong>. You&apos;re now ready to run your first
                    scan&nbsp;🚀
                </p>
            </>
        ),
    },
];
